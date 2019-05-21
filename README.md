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
