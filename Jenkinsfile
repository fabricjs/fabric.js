#!groovy

pipeline {
    agent { label 'ubuntu1404-xl' }

    tools {
        nodejs 'node-v12.13.0'
    }

    environment {
        HOME="."
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('publish') {
            when {
                allOf {
                    branch 'main'
                    expression {
                        continueIfNotCiSkip()
                    }
                }

            }
            steps {
                echo "Publishing to our registry."

                sshagent(credentials: ['newco-bitbucket']) {
                    withNPM(npmrcConfig: 'amplify-npm-config') {
                        sh 'bin/publish.sh'
                    }
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}

def continueIfNotCiSkip() {
    def result = sh(script: "git log -1 | grep '\\[ci-skip\\].*'", returnStatus: true)
    return result != 0
}