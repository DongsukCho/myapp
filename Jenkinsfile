pipeline {
  agent any

  environment {
    IMAGE = "myapp:latest"
  }

  stages {

    stage('Clone') {
      steps {
        git 'https://github.com/your-repo/myapp.git'
      }
    }

    stage('Build Docker') {
      steps {
        sh 'docker build -t $IMAGE .'
      }
    }

    stage('Deploy to K8s') {
      steps {
        sh 'kubectl apply -f deployment.yaml'
        sh 'kubectl apply -f service.yaml'
      }
    }
  }
}
