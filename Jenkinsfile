pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        REGISTRY = '10.20.20.48:5000'
        IMAGE_NAME = 'invitation-paper'
        TRIVY_IMAGE = 'aquasec/trivy:0.75.0'

        K8S_SERVER = 'https://10.20.20.133:6443'
        K8S_CA = '/var/lib/jenkins/k3s-invitation-paper-ca.crt'
        K8S_NAMESPACE = 'invitation-paper'
        K8S_KUBECTL = '/usr/local/bin/kubectl'
        K8S_NODE_IP = '10.20.20.133'

        EXPECTED_REPLICAS = '2'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                sh '''
                    podman run --rm \
                      --user "$(id -u):$(id -g)" \
                      -v "$PWD:/src:ro,Z" \
                      -e HOME=/tmp \
                      -e npm_config_cache=/tmp/npm-cache \
                      node:22-trixie \
                      sh -c '
                        mkdir -p /tmp/workspace &&
                        tar -C /src \
                          --exclude=node_modules \
                          --exclude=.next \
                          --exclude=.git \
                          -cf - . |
                        tar -C /tmp/workspace -xf - &&
                        cd /tmp/workspace &&
                        npm ci --include=optional &&
                        npm run lint
                      '
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    podman build \
                      --pull=always \
                      -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                      .
                '''
            }
        }

        stage('Security Scan') {
            steps {
                sh '''
                    rm -f invitation-paper-image.tar

                    podman save \
                      -o invitation-paper-image.tar \
                      ${IMAGE_NAME}:${BUILD_NUMBER}

                    echo "===== Trivy Security Scan ====="

                    podman run --rm \
                      -v /var/lib/jenkins/trivy-cache:/root/.cache/trivy:Z \
                      -v "$PWD/invitation-paper-image.tar:/scan/image.tar:ro,Z" \
                      ${TRIVY_IMAGE} \
                      --cache-dir /root/.cache/trivy \
                      image \
                      --input /scan/image.tar \
                      --scanners vuln \
                      --severity HIGH,CRITICAL
                '''
            }
        }

        stage('Security Gate') {
            steps {
                sh '''
                    echo "===== Trivy Security Gate ====="
                    echo "Policy: CRITICAL vulnerabilities must be zero"

                    podman run --rm \
                      -v /var/lib/jenkins/trivy-cache:/root/.cache/trivy:Z \
                      -v "$PWD/invitation-paper-image.tar:/scan/image.tar:ro,Z" \
                      ${TRIVY_IMAGE} \
                      --cache-dir /root/.cache/trivy \
                      image \
                      --input /scan/image.tar \
                      --scanners vuln \
                      --severity CRITICAL \
                      --exit-code 1

                    echo "===== Security Gate Passed ====="
                    echo "No CRITICAL vulnerabilities detected."
                '''
            }
        }

        stage('Push Registry') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'registry-invitation-paper',
                        usernameVariable: 'REGISTRY_USER',
                        passwordVariable: 'REGISTRY_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$REGISTRY_PASSWORD" | \
                          podman login "$REGISTRY" \
                          --username "$REGISTRY_USER" \
                          --password-stdin

                        podman tag \
                          ${IMAGE_NAME}:${BUILD_NUMBER} \
                          ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}

                        podman tag \
                          ${IMAGE_NAME}:${BUILD_NUMBER} \
                          ${REGISTRY}/${IMAGE_NAME}:latest

                        podman push \
                          ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}

                        podman push \
                          ${REGISTRY}/${IMAGE_NAME}:latest

                        podman logout "$REGISTRY"
                    '''
                }
            }
        }

        stage('Deploy K3s') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'k3s-invitation-paper-token',
                        variable: 'K8S_TOKEN'
                    )
                ]) {
                    sh '''
                        set -eu

                        KUBECONFIG_FILE="$(mktemp)"

                        trap 'rm -f "$KUBECONFIG_FILE" "$WORKSPACE/deployment-rendered.yaml"' EXIT

                        cat > "$KUBECONFIG_FILE" <<KUBECONFIG
apiVersion: v1
kind: Config
clusters:
  - name: invitation-paper-cluster
    cluster:
      server: ${K8S_SERVER}
      certificate-authority: ${K8S_CA}
users:
  - name: jenkins-invitation-paper
    user:
      token: ${K8S_TOKEN}
contexts:
  - name: invitation-paper
    context:
      cluster: invitation-paper-cluster
      user: jenkins-invitation-paper
      namespace: ${K8S_NAMESPACE}
current-context: invitation-paper
KUBECONFIG

                        chmod 600 "$KUBECONFIG_FILE"

                        sed \
                          "s/__IMAGE_TAG__/${BUILD_NUMBER}/g" \
                          manifests/deployment.yaml \
                          > "$WORKSPACE/deployment-rendered.yaml"

                        touch "$WORKSPACE/.deployment-attempted"
                        ${K8S_KUBECTL} \
                          --kubeconfig="$KUBECONFIG_FILE" \
                          apply \
                          -f "$WORKSPACE/deployment-rendered.yaml"

                        ${K8S_KUBECTL} \
                          --kubeconfig="$KUBECONFIG_FILE" \
                          apply \
                          -f manifests/service.yaml

                        ${K8S_KUBECTL} \
                          --kubeconfig="$KUBECONFIG_FILE" \
                          -n "$K8S_NAMESPACE" \
                          rollout status \
                          deployment/"$IMAGE_NAME" \
                          --timeout=180s

                        ${K8S_KUBECTL} \
                          --kubeconfig="$KUBECONFIG_FILE" \
                          -n "$K8S_NAMESPACE" \
                          get deployment,service,pods \
                          -o wide
                    '''
                }
            }
        }

        stage('Verify') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'k3s-invitation-paper-token',
                        variable: 'K8S_TOKEN'
                    )
                ]) {
                    sh '''
                        set -eu

                        KUBECONFIG_FILE="$(mktemp)"

                        trap 'rm -f "$KUBECONFIG_FILE"' EXIT

                        cat > "$KUBECONFIG_FILE" <<KUBECONFIG
apiVersion: v1
kind: Config
clusters:
  - name: invitation-paper-cluster
    cluster:
      server: ${K8S_SERVER}
      certificate-authority: ${K8S_CA}
users:
  - name: jenkins-invitation-paper
    user:
      token: ${K8S_TOKEN}
contexts:
  - name: invitation-paper
    context:
      cluster: invitation-paper-cluster
      user: jenkins-invitation-paper
      namespace: ${K8S_NAMESPACE}
current-context: invitation-paper
KUBECONFIG

                        chmod 600 "$KUBECONFIG_FILE"

                        echo "===== Verify Deployment ====="

                        DESIRED_REPLICAS="$(
                            ${K8S_KUBECTL} \
                              --kubeconfig="$KUBECONFIG_FILE" \
                              -n "$K8S_NAMESPACE" \
                              get deployment "$IMAGE_NAME" \
                              -o jsonpath='{.spec.replicas}'
                        )"

                        UPDATED_REPLICAS="$(
                            ${K8S_KUBECTL} \
                              --kubeconfig="$KUBECONFIG_FILE" \
                              -n "$K8S_NAMESPACE" \
                              get deployment "$IMAGE_NAME" \
                              -o jsonpath='{.status.updatedReplicas}'
                        )"

                        AVAILABLE_REPLICAS="$(
                            ${K8S_KUBECTL} \
                              --kubeconfig="$KUBECONFIG_FILE" \
                              -n "$K8S_NAMESPACE" \
                              get deployment "$IMAGE_NAME" \
                              -o jsonpath='{.status.availableReplicas}'
                        )"

                        CURRENT_IMAGE="$(
                            ${K8S_KUBECTL} \
                              --kubeconfig="$KUBECONFIG_FILE" \
                              -n "$K8S_NAMESPACE" \
                              get deployment "$IMAGE_NAME" \
                              -o jsonpath='{.spec.template.spec.containers[0].image}'
                        )"

                        READINESS_PATH="$(
                            ${K8S_KUBECTL} \
                              --kubeconfig="$KUBECONFIG_FILE" \
                              -n "$K8S_NAMESPACE" \
                              get deployment "$IMAGE_NAME" \
                              -o jsonpath='{.spec.template.spec.containers[0].readinessProbe.httpGet.path}'
                        )"

                        READINESS_PORT="$(
                            ${K8S_KUBECTL} \
                              --kubeconfig="$KUBECONFIG_FILE" \
                              -n "$K8S_NAMESPACE" \
                              get deployment "$IMAGE_NAME" \
                              -o jsonpath='{.spec.template.spec.containers[0].readinessProbe.httpGet.port}'
                        )"

                        LIVENESS_PATH="$(
                            ${K8S_KUBECTL} \
                              --kubeconfig="$KUBECONFIG_FILE" \
                              -n "$K8S_NAMESPACE" \
                              get deployment "$IMAGE_NAME" \
                              -o jsonpath='{.spec.template.spec.containers[0].livenessProbe.httpGet.path}'
                        )"

                        LIVENESS_PORT="$(
                            ${K8S_KUBECTL} \
                              --kubeconfig="$KUBECONFIG_FILE" \
                              -n "$K8S_NAMESPACE" \
                              get deployment "$IMAGE_NAME" \
                              -o jsonpath='{.spec.template.spec.containers[0].livenessProbe.httpGet.port}'
                        )"

                        NODE_PORT="$(
                            ${K8S_KUBECTL} \
                              --kubeconfig="$KUBECONFIG_FILE" \
                              -n "$K8S_NAMESPACE" \
                              get service "$IMAGE_NAME" \
                              -o jsonpath='{.spec.ports[0].nodePort}'
                        )"

                        echo "Expected image:"
                        echo "${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"

                        echo "Actual image:"
                        echo "$CURRENT_IMAGE"

                        echo "Desired replicas:   $DESIRED_REPLICAS"
                        echo "Updated replicas:   $UPDATED_REPLICAS"
                        echo "Available replicas: $AVAILABLE_REPLICAS"

                        echo "Readiness probe: path=$READINESS_PATH port=$READINESS_PORT"
                        echo "Liveness probe:  path=$LIVENESS_PATH port=$LIVENESS_PORT"

                        echo "NodePort: $NODE_PORT"

                        test "$DESIRED_REPLICAS" = "$EXPECTED_REPLICAS"
                        test "$UPDATED_REPLICAS" = "$EXPECTED_REPLICAS"
                        test "$AVAILABLE_REPLICAS" = "$EXPECTED_REPLICAS"

                        test "$CURRENT_IMAGE" = \
                          "${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"

                        test "$READINESS_PATH" = "/"
                        test "$READINESS_PORT" = "3000"

                        test "$LIVENESS_PATH" = "/"
                        test "$LIVENESS_PORT" = "3000"

                        HTTP_CODE="$(
                            curl -sS \
                              -o /dev/null \
                              -w '%{http_code}' \
                              "http://${K8S_NODE_IP}:${NODE_PORT}/"
                        )"

                        echo "HTTP status: $HTTP_CODE"

                        test "$HTTP_CODE" = "200"


                        echo
                        echo '========================================'
                        echo ' INVITATION PAPER DEPLOYMENT SUMMARY'
                        echo '========================================'
                        echo "Build:             #${BUILD_NUMBER}"
                        echo "Image:             ${CURRENT_IMAGE}"
                        echo "Replicas:          ${AVAILABLE_REPLICAS}/${DESIRED_REPLICAS}"
                        echo 'Readiness Probe:   PASS'
                        echo 'Liveness Probe:    PASS'
                        echo 'Security Gate:     PASS'
                        echo "HTTP Check:        ${HTTP_CODE}"
                        echo 'Deployment:        SUCCESS'
                        echo '========================================'
                        echo
                        echo "===== Verification Passed ====="

                        ${K8S_KUBECTL} \
                          --kubeconfig="$KUBECONFIG_FILE" \
                          -n "$K8S_NAMESPACE" \
                          get deployment,service,pods \
                          -o wide
                    '''
                }
            }
        }
    }

    post {
        failure {
            script {
                if (fileExists("${WORKSPACE}/.deployment-attempted")) {
                    echo '===== Automatic Rollback ====='
                    echo 'Pipeline failed after deployment started.'
                    echo 'Rolling back to the previous Kubernetes revision.'

                    withCredentials([
                        string(
                            credentialsId: 'k3s-invitation-paper-token',
                            variable: 'K8S_TOKEN'
                        )
                    ]) {
                        sh '''
                            set -eu

                            KUBECONFIG_FILE="$(mktemp)"
                            trap 'rm -f "$KUBECONFIG_FILE"' EXIT

                            cat > "$KUBECONFIG_FILE" <<KUBECONFIG
apiVersion: v1
kind: Config
clusters:
  - name: invitation-paper-cluster
    cluster:
      server: ${K8S_SERVER}
      certificate-authority: ${K8S_CA}
users:
  - name: jenkins-invitation-paper
    user:
      token: ${K8S_TOKEN}
contexts:
  - name: invitation-paper
    context:
      cluster: invitation-paper-cluster
      user: jenkins-invitation-paper
      namespace: ${K8S_NAMESPACE}
current-context: invitation-paper
KUBECONFIG

                            chmod 600 "$KUBECONFIG_FILE"

                            ${K8S_KUBECTL}                               --kubeconfig="$KUBECONFIG_FILE"                               -n "$K8S_NAMESPACE"                               rollout undo                               deployment/"$IMAGE_NAME"

                            ${K8S_KUBECTL}                               --kubeconfig="$KUBECONFIG_FILE"                               -n "$K8S_NAMESPACE"                               rollout status                               deployment/"$IMAGE_NAME"                               --timeout=180s

                            echo
                            echo '===== Rollback Completed ====='

                            ${K8S_KUBECTL}                               --kubeconfig="$KUBECONFIG_FILE"                               -n "$K8S_NAMESPACE"                               get deployment,service,pods                               -o wide
                        '''
                    }
                }
            }
        }

        always {
            sh '''
                rm -f invitation-paper-image.tar || true
                podman image rm ${IMAGE_NAME}:${BUILD_NUMBER} 2>/dev/null || true
            '''
        }
        cleanup {
            sh '''
                rm -f "$WORKSPACE/.deployment-attempted" || true
            '''
        }

    }
}
