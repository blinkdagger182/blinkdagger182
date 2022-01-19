FROM nginx:1.14.0
COPY dist /usr/share/nginx/html
LABEL maintainer="Mohammad Harris Mokhtar <harris@tmrnd.com.my>"