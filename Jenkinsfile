pipeline {
  agent {
    kubernetes {
        yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-sa
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:latest

  - name: node
    image: node:18-alpine
    command: ['cat']
    tty: true

  - name: helm
    image: alpine/helm:3.12.0
    command: ['cat']
    tty: true

  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
    - cat
    tty: true
    volumeMounts:
    - name: kaniko-secret
      mountPath: /kaniko/.docker

  volumes:
  - name: kaniko-secret
    secret:
      secretName: harbor-secret
      items:
      - key: .dockerconfigjson
        path: config.json
"""
    }
  }

  environment {
    IMAGE_NAME = "myapp:latest"
    HARBOR_URL = "harbor.default.svc.cluster.local"
    HARBOR_IMAGE = "${HARBOR_URL}/library/${IMAGE_NAME}"
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/DongsukCho/myapp.git'
      }
    }

    stage('Install & Build') {
      steps {
        container('node') {
          sh 'npm install'
        }
      }
    }

    stage('Kaniko Build & Push') {
      steps {
        container('kaniko') {
          sh """
          /kaniko/executor \
            --dockerfile=Dockerfile \
            --context=${WORKSPACE} \
            --destination=${HARBOR_IMAGE} \
            --insecure \
            --skip-tls-verify
          """
        }
      }
    }


    stage('Deploy') {
      steps {
        container('helm') {
          sh """
          helm upgrade --install myapp ./chart \
            --set image.repository=${HARBOR_URL}/library/myapp \
            --set image.tag=latest
          """
        }
      }
    }

  }
}
