FROM library/node:0.10

RUN apt-get update && apt-get install -y npm git

WORKDIR /home

EXPOSE 2718

CMD git clone -b master https://github.com/frlender/matrixTransformation.git \
	&& cd matrixTransformation \
	&& npm install \
	&& npm install -g grunt-cli \
	&& npm install -g bower \
	&& bower -F install --allow-root \
	&& grunt
