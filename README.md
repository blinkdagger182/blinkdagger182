# README #

This for GHCM portal source code.
This for example.

Job Advertisement beta released. 

# Deployment on Production Environment
#### Build Distribution Files
```
git pull origin master
npm install
rm -R dist
node_modules/@angular/cli/bin/ng build --prod
cp .htaccess dist
```

#### Build Container Image and Push to Harbor
At the build server, we create the portal image that contains the dist folder
```
docker login 172.20.46.100
docker build -t=ghcm/portal .
docker tag ghcm/portal 172.20.46.100/era/portal
docker push 172.20.46.100/era/portal
docker logout 172.20.46.100
```

#### Copy Image to Production server
At the Production server, we need to deploy the Portal container to get the distribution files. 
```
docker login 172.20.46.100
docker pull 172.20.46.100/era/portal
docker tag 172.20.46.100/era/portal ghcm/portal
docker run -d --name dummyPortal ghcm/portal
docker cp dummyPortal:/data ~vol/eraPortal/dist/
docker stop dummyPortal
docker rm dummyPortal
docker logout 172.20.46.100
```

#### Deploy
```
docker restart eraPortal
```

# Configuration on Production Environment
Follows are the procedure for initial setup at the Production Environment. 
Only need to be done once

Edit the eraPortal/conf/httpd.conf file and update the following section

```
LoadModule rewrite_module modules/mod_rewrite.so
```

```
<Directory "/usr/local/apache2/htdocs">
...
   AllowOverride All
...
</Directory>
```



"# blinkdagger182" 
