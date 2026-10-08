pipeline {
    agent any

    environment {
        REGISTRY = '10.20.20.48:5000'
        IMAGE_NAME = 'invitation-paper'
        TRIVY_IMAGE = 'aquasec/trivy:0.75.0'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

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
