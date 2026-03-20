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

    - name: node
      image: node:18-alpine
      command: ['cat']
      tty: true

    - name: docker
      image: docker:20.10.24
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
    IMAGE_NAME = "myapp:latest"
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
          sh 'sleep 3600'
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
  }
}
