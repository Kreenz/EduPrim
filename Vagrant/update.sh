#---------------------------------------------
USER=""
PASSWORD=""
#---------------------------------------------

# Actualizamos el proyecto
cd eduprim
git pull https://$USER:$PASSWORD@git.copernic.cat/munoz.jorquera.diego/eduprim.git

## Recarga de los datos de idioma
mysql --execute="source /home/vagrant/m14-prueba/BBDD/EduPrimData.sql";
