pipeline {
  agent {
    kubernetes {
        label 'jnlp-agent'
        yamlFile 'jenkins-agent-pod.yaml'
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

    stage('Run Test Container') {
      steps {
        container('docker') {
          sh 'docker run -d -p 3000:3000 $IMAGE_NAME'
        }
      }
    }
  }
}
