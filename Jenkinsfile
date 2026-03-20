pipeline {
  agent {
    kubernetes {
        label 'jnlp-agent'
        defaultContainer 'git'
        yamlFile 'jenkins-agent-pod.yaml'
    }
  }

  environment {
    IMAGE = "myapp:latest"
  }

  stages {
    stage('Install Dependencies') {
      steps {
        container('node') {
          sh 'npm install'
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
