window.onload = function () {

    document.getElementById("selectedActivity").addEventListener("click",function(){
      loadStats("actividad", 0, getId(document.getElementById("activityList").value), 0).then(data => {
        if(data){
          document.getElementById("pageBody").innerHTML = "";
          let head = document.createElement("h2");
          head.setAttribute("class", "t-yusei t-b");
          let sel = document.getElementById("activityList");
          head.innerText = sel.options[sel.selectedIndex].text;
          document.getElementById("pageBody").appendChild(head);
          let canvas = document.createElement("canvas");
          canvas.id = "grafic";
          document.getElementById("pageBody").appendChild(canvas);
          let dataSet = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0
          };

          let aprovats = 0;
          console.log(data);
          for(let i = 0; i < data.length; i++){
            dataSet[Math.round((data[i].aciertos / data[i].respuestas.length) * 10)]++;
            if(data[i].aciertos >= data[i].respuestas.length/2) aprovats++;
          }
          
          let container = document.createElement("div");
          let percent = document.createElement("span");
          let textAprovats = document.createElement("span");
          
          container.setAttribute("class", "flex-row fW center space-around m-b1");
          percent.setAttribute("class", "t-yusei t-m");
          textAprovats.setAttribute("class", "t-yusei t-m");

          percent.innerText = "Porcentaje de Aprobados: " + ((aprovats * 100) / data.length) + "%";
          textAprovats.innerText = "Aprobados: " + aprovats + "/" + data.length;

          container.appendChild(textAprovats);
          container.appendChild(percent);
          
          document.getElementById("pageBody").appendChild(container)
          console.log("aaa");
          console.log(dataSet);
          generateCanvas(dataSet);
        } else {
          document.getElementById("pageBody").innerHTML = "";
          let span = document.createElement("span");
          span.setAttribute("class", "t-yusei t-b");
          span.innerText = "NO HAY DATOS A MOSTRAR";
          document.getElementById("pageBody").appendChild(span);
        }
      });
    })
    document.getElementById("selectedStudent").addEventListener("click",function(){
      loadStats("usuario", 0, getId(document.getElementById("activityList").value), getId(document.getElementById("studentList").value)).then(data => {
        if(data){
          document.getElementById("pageBody").innerHTML = "";
          let head = document.createElement("h2");
          let text = document.createElement("span");
          text.setAttribute("class", "t-yusei t-b");
          head.setAttribute("class", "t-yusei t-b");
          let sel = document.getElementById("activityList");
          head.innerText = sel.options[sel.selectedIndex].text;
          let container = document.createElement("div");
          container.setAttribute("class", "flex-row center space-around fW");

          for(let i = 0; i < data[0].respuestas.length; i++){
              let res = document.createElement("div");
              let inTxt = document.createElement("span");
              res.setAttribute("class", "flex-column center resContainer");
              res.classList.add((data[0].respuestas[i].respuesta) ? "green" : "red");
              inTxt.innerText = data[0].respuestas[i].num;
              inTxt.setAttribute("class", "t-yusei t-m")
              res.appendChild(inTxt);

              container.appendChild(res);
          }

          document.getElementById("pageBody").appendChild(head);
          text.innerText = "ACIERTOS: " + data[0].aciertos + "/" + data[0].respuestas.length + ".";
          document.getElementById("pageBody").appendChild(text);
          document.getElementById("pageBody").appendChild(container);

          if(data[0].respuestas.length == 0) {
              let noHayDatos = document.createElement("span");
              noHayDatos.setAttribute("class", "t-yusei t-b");
              noHayDatos.innerText = "No hay datos disponibles";
              document.getElementById("pageBody").appendChild(noHayDatos);
          }
          
        }
      });
    })

    loadDropboxList("grupo").then(resolve => {
      if(resolve)loadDropboxList("actividad").then(resolve => {
        if(resolve)loadDropboxList("usuario");
      });
    });

    document.getElementById("activityList").addEventListener("change", () => {
      loadDropboxList("usuario").then(resolve => {
        if(resolve){
          
        }
      })
    });

}

function generateCanvas(dataSet){
  var ctx = document.getElementById('grafic').getContext('2d');

  let labels = [];
  let data = [];

  Object.keys(dataSet).forEach(element => {
    labels.push(element);
    data.push(dataSet[element]);
  })

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Notas por Actividad',
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
  });
}