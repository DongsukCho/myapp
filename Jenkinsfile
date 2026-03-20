pipeline {
  agent {
    kubernetes {
        label 'jnlp-agent'
        yamlFile 'jenkins-agent-pod.yaml'
    }
  }

  environment {
    IMAGE = "myapp:latest"
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/DongsukCho/myapp.git'
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
