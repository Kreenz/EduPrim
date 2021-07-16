var contenido;


var stage; //Elemento a agarrar
var initCoords = {
    x: 0,
    y: 0
}; //cordenadas iniciales


function populateRespuestaArrastrarVacio(index) {

   // crearKinect(index);
    crearKinect2();

}



function crearKinect(index) {

    stage = new Kinetic.Stage({
        container: 'pizarra-wide',
        width: 1624,
        height: 320
    });

    let layer = new Kinetic.Layer();

    let text = new Kinetic.Text({
        x: 10,
        y: 10,
        fontFamily: 'Calibri',
        fontSize: 24,
        text: data_preguntas[index].enunciado,
        fill: 'white'
    })



    //CREACIÓN OPCION
    let box;
    box = new Kinetic.Rect({
        x: 589,
        y: 100,
        width: 100,
        height: 50,
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
        id: 1,
        name:"MARICON",
        
        
    })

    let boxText = new Kinetic.Text({
        x: 10,
        y: 10,
        text: 'HOLA',
        fontSize: 20,
        textFill: 'white',
        id: 1
    })



    // box.textContent = data_respuestas[index][0].respuesta
    layer.add(boxText)

    console.log(boxText.getParent());
    layer.add(box);
    console.log(box)
    //AÑADIR LOS OBJETOS A LA PIZZARRA
    //layer.add(text);



    
    stage.add(layer)
    stage.draw();



}




function writeMessage(text, message) {
    text.text(message);
    layer.draw();
}



function crearKinect2(){
    var stage = new Kinetic.Stage({
        container: 'pizarra-wide',
        width: 578,
        height: 200
    });
    var layer = new Kinetic.Layer();
    
    //just setting up the Stage and Layer
    
    var group = new Kinetic.Group({
        draggable: true
    });
    
    //create the group
    
    var rectangle = new Kinetic.Rect({
    
        x: 5,
        y: 5,
        width: 80,
        height: 35,
        fill: "green",
        stroke: "black",
        strokeWidth: 2
    
    });
    
    //rectangle first
    
    var rectangleText = new Kinetic.Text({
    
        x: 15,
        y: 10,
        text: 'test',
        fontSize: 20,
        fontFamily: 'Calibri',
        textFill: 'black'
    
    });
    
    //text object
    
    group.add(rectangle);
    group.add(rectangleText);
    
    console.log(group)
    //add the rectangle first then the text on top
    

    layer.add(group.rectangleText.te);
    
    //add group to layer
    
    stage.add(layer);
    //add layer to stage
    
}