pipeline {
  agent {
    kubernetes {
        yaml """
apiVersion: v1
kind: Pod
spec:
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

    - name: docker
      image: docker:24.0
      command: ['cat']
      tty: true
      volumeMounts:
        - name: docker-sock
          mountPath: /var/run/docker.sock

  volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
"""
    }
  }

  environment {
    IMAGE_NAME = "myapp:${BUILD_NUMBER}"
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

    stage('Docker Build') {
      steps {
        container('docker') {
          sh 'docker build -t $IMAGE_NAME .'
        }
      }
    }

    stage('Login to Harbor') {
      steps {
        container('docker') {
          withCredentials([usernamePassword(credentialsId: 'harbor-admin', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
            sh "docker login http://${HARBOR_URL} -u $USER -p $PASS"
          }
        }
      }
    }

    stage('Push to Harbor') {
      steps {
        sh "docker push ${IMAGE_NAME}"
      }
    }

    stage('Deploy') {
      steps {
        container('helm') {
          sh """
          helm upgrade --install myapp ./chart \
            --set image.repository=${HARBOR_URL}/library/myapp \
            --set image.tag=${BUILD_NUMBER}
          """
        }
      }
    }

  }
}
