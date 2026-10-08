pipeline {
    agent any

    environment {
        REGISTRY = '10.20.20.48:5000'
        IMAGE_NAME = 'invitation-paper'
        TRIVY_IMAGE = 'aquasec/trivy:0.75.0'
        K8S_SERVER = 'https://10.20.20.133:6443'
        K8S_CA = '/var/lib/jenkins/k3s-invitation-paper-ca.crt'
        K8S_NAMESPACE = 'invitation-paper'
        K8S_KUBECTL = '/usr/local/bin/kubectl'
    }

    stages {

        stage('Build & Test') {
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

                        ${K8S_KUBECTL} \
                          --kubeconfig="$KUBECONFIG_FILE" \
                          apply -f "$WORKSPACE/deployment-rendered.yaml"

                        ${K8S_KUBECTL} \
                          --kubeconfig="$KUBECONFIG_FILE" \
                          apply -f manifests/service.yaml

                        ${K8S_KUBECTL} \
                          --kubeconfig="$KUBECONFIG_FILE" \
                          -n "$K8S_NAMESPACE" \
                          rollout status deployment/"$IMAGE_NAME" \
                          --timeout=180s

                        ${K8S_KUBECTL} \
                          --kubeconfig="$KUBECONFIG_FILE" \
                          -n "$K8S_NAMESPACE" \
                          get deployment,service,pods -o wide
                    '''
                }
            }
        }
    }

    post {
        always {
            sh '''
                rm -f invitation-paper-image.tar || true
                podman image rm ${IMAGE_NAME}:${BUILD_NUMBER} 2>/dev/null || true
            '''
        }
    }
}
