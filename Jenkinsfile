pipeline {
  agent {
    kubernetes {
        label 'jnlp-agent'
        yamlFile 'jenkins-agent-pod.yaml'
    }
  }

  environment {
    GIT_TOOL = "/usr/bin/git"
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
