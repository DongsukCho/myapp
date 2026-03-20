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

    - name: git
      image: alpine/git:latest
      command: ['cat']
      tty: true

    - name: docker
      image: docker:24
      command: ['cat']
      tty: true
      volumeMounts:
        - name: docker-sock
          mountPath: /var/run/docker.sock

    - name: helm
      image: alpine/helm:3.14.0
      command: ['cat']
      tty: true

    - name: kubectl
      image: bitnami/kubectl
      command: ['cat']
      tty: true

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
        container('git') {
          git branch: 'main', url: 'https://github.com/DongsukCho/myapp.git'
        }
      }
    }

    stage('Build') {
      steps {
        container('docker') {
          sh 'docker build -t $IMAGE .'
        }
      }
    }

    stage('Deploy (Helm)') {
      steps {
        container('helm') {
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
