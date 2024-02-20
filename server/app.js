const express = require('express');
const app = express();
const { exec } = require('child_process');
const fs = require('fs');

// Función para ejecutar un comando del sistema y retornar una promesa con su salida
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

  

// Ruta para obtener el informe del servidor
app.get('/server/api/report', async (req, res) => {
  try {
    // Obtener la lista de procesos en ejecución
    const psOutput = await executeCommand('ps aux');
    const pm2Output = await executeCommand('pm2 list');

    // Obtener la lista de puertos en uso
    const netstatOutput = await executeCommand('netstat -tuln');

    // Obtener el estado de la memoria
    const memoryOutput = await executeCommand('free -m');

    // Obtener el estado de la CPU
    const cpuOutput = await executeCommand('top -n 1 -b');
    // Guardar el contenido HTML en un archivo
    const reportData = {
        processes: psOutput,
        pm2: pm2Output,
        ports: netstatOutput,
        memory:memoryOutput,
        cpu: cpuOutput
    };

    res.json(reportData);
  } catch (error) {
    console.error('Error generating server report:', error);
  }
});
app.get('/hi',(req, res)=> {
  res.json({
      ok:true,
  })
})
// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
