# Gcloud shell でコマンド

gcloud config set project spotifiretokyo
gcloud config set compute/zone us-west1-c
gcloud container clusters get-credentials spotifire-cluster
kubectl create secret generic passwordname --from-literal PASSWORDNAME=......


# HELM 
# インストール
curl -LO https://git.io/get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh

#Assigning TIller a Service Acccount

kubectl create serviceaccount --namespace kube-system tiller
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

helm init --service-account tiller --upgrade

# Ingress-Nginxのインストール
helm install stable/nginx-ingress --name my-nginx --set rbac.create=true


# https化につかうもの
https://github.com/jetstack/cert-manager


# Install the CustomResourceDefinition resources separately
kubectl apply --validate=false -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.7/deploy/manifests/00-crds.yaml 

# Create the namespace for cert-manager
kubectl create namespace cert-manager

# Label the cert-manager namespace to disable resource validation
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true

# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install \
  --name cert-manager \
  --namespace cert-manager \
  --version v0.7.2 \
  jetstack/cert-manager
