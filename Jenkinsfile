pipeline {
  agent {
    kubernetes {
        label 'jnlp-agent'
        yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:latest

  - name: tools
    image: my-jenkins-agent:latest
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
    IMAGE = "myapp:latest"
  }

  stages {
    stage('Checkout') {
      steps {
        container('tools') {
          git 'https://github.com/DongsukCho/myapp.git'
        }
      }
    }

    stage('Build') {
      steps {
        container('tools') {
          sh 'docker build -t $IMAGE .'
        }
      }
    }

    stage('Deploy (Helm)') {
      steps {
        container('tools') {
          sh '''
          helm upgrade --install myapp ./chart \
            --set image.repository=myapp \
            --set image.tag=latest
          '''
        }
      }
    }
  }
}
