#---------------------------------------------
USER=""
PASSWORD=""
#---------------------------------------------

# instalamos git, curl y nodejs
apt update -y
apt upgrade -y
apt install curl git -y
curl -sL https://deb.nodesource.com/setup_14.x | bash - && apt install nodejs -y  # Instalamos la version 14.x de node.js

#Instalamos mysql con un usuario y password por defecto
debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
apt install -y mysql-server

# Clonamos el proyecto
git clone https://$USER:$PASSWORD@git.copernic.cat/munoz.jorquera.diego/eduprim.git

#Creamos un script para poner en marcha el servidor rapidamente
echo nodejs eduprim/EduPrim/server.js > start.sh
chmod 777 start.sh

#Inicializamos la BBDD
mysql --execute="source /home/vagrant/eduprim/BBDD/EduPrimTables.sql";
mysql --execute="source /home/vagrant/eduprim/BBDD/EduPrimData.sql";

# Dependencias de node.js
cd /home/vagrant/eduprim/EduPrim/
npm install express
npm install mysql
npm install express-session
npm install bcryptjs
npm install js-yaml
echo "{\"host\": \"localhost\",\"user\": \"eduprim\",\"password\": \"root\",\"database\": \"EduPrim\",\"connectionLimit\": 10}" >> mysql-config.json


