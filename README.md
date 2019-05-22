# Gcloud shell でコマンド

gcloud config set project spotifire-cluster	
gcloud config set compute/zone us-west1-c
gcloud container clusters get-credentials spotifire-cluster

# シークレットの作成方法
kubectl create secret generic passwordname --from-literal PASSWORDNAME=......


# HELM 
# インストール
### これはやらない！これだとHELM 2.14版が入ってしまい、いろいろエラーが起きる！
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh

wget https://storage.googleapis.com/kubernetes-helm/helm-v2.13.0-rc.1-linux-amd64.tar.gz
tar -zxvf helm-v2.13.0-rc.1-linux-amd64.tar.gz
ls -al linux-amd64/helm
mv linux-amd64/helm /usr/local/bin/helm
(ここを参考に。https://qiita.com/nykym/items/1573ca568a80d0d01c45)

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
    helm install --name cert-manager --namespace cert-manager --version v0.7.2 jetstack/cert-manager

httpsが使えるように
# 参考  (https://qiita.com/apstndb/items/3a39a1e6acacbbc30765)
# 今回は DNS には Cloud DNS を使うため、 cert-manager が Cloud DNS を使えるように GCP のサービスアカウント設定
gcloud projects add-iam-policy-binding spotifire-tokyo --member serviceAccount:cert-manager@spotifire-tokyo.iam.gserviceaccount.com --role roles/dns.admin

#
gcloud iam service-accounts keys create cert-manager-key.json --iam-account cert-manager@spotifire-tokyo.iam.gserviceaccount.com

#
kubectl create secret generic clouddns-service-account --from-file=cert-manager-key.json -n cert-manager 

