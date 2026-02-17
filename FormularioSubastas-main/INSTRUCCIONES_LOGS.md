# Cómo Ver los Logs de Google Apps Script

## Método 1: Ver Logs de Ejecución (Recomendado)

1. **Abre tu proyecto de Google Apps Script**
   - Ve a [script.google.com](https://script.google.com)
   - Abre tu proyecto

2. **Ve a la sección de Logs**
   - En el menú superior, haz clic en **"Ver"** (o **"View"**)
   - Selecciona **"Logs de ejecución"** (o **"Execution log"**)
   - O presiona `Ctrl + Enter` (Windows) o `Cmd + Enter` (Mac)

3. **Ejecuta una prueba**
   - Antes de ver los logs, ejecuta la función de prueba:
     - En el menú desplegable de funciones (arriba), selecciona **"testConnection"**
     - Haz clic en el botón de **"Ejecutar"** (▶️)
   - O envía el formulario desde tu aplicación

4. **Revisa los logs**
   - Los logs aparecerán en la parte inferior de la pantalla
   - Verás mensajes como "doPost called", "Parsing multipart data...", etc.
   - Si hay un error, verás "FATAL ERROR:" seguido del mensaje

## Método 2: Ver Logs desde el Editor

1. **Abre el editor de Apps Script**
2. **Haz clic en el ícono de "Reloj" (⏰)** en la barra lateral izquierda
   - Esto abre el "Visor de ejecuciones"
3. **Selecciona una ejecución reciente**
   - Verás una lista de todas las ejecuciones
   - Haz clic en la más reciente (la que dice "doPost")
4. **Revisa los detalles**
   - Verás el estado (Éxito o Error)
   - Haz clic en la ejecución para ver los logs detallados

## Método 3: Ejecutar Función de Prueba

1. **Abre tu proyecto de Google Apps Script**
2. **Selecciona la función `testConnection`** en el menú desplegable
3. **Haz clic en "Ejecutar" (▶️)**
4. **Revisa los logs** - Verás mensajes como:
   - "=== TEST CONNECTION ==="
   - "Test 1: Checking spreadsheet access..."
   - "✓ Spreadsheet accessed successfully"
   - etc.

## Qué Buscar en los Logs

Si hay un error, busca líneas que contengan:
- **"FATAL ERROR:"** - Error principal
- **"Error:"** - Errores específicos
- **"✗"** - Tests que fallaron
- **"Stack:"** - Stack trace del error

## Ejemplo de Logs Exitosos

```
doPost called
e.postData: exists
e.postData.type: multipart/form-data
Parsing multipart data...
Multipart parsed successfully
Fields: email, razonSocial, nit, ...
Validation passed
Creating user folder...
User folder created/retrieved
Uploading files...
Files uploaded: 2
Saving main row...
Main row saved
Saving projects...
Projects saved
Success!
```

## Ejemplo de Logs con Error

```
doPost called
e.postData: exists
Parsing multipart data...
FATAL ERROR: Error processing request: Sheet 'Respuestas' not found
Stack: at saveMainRow (Code:138:5)
```

## Solución Rápida

Si ves el error **"Sheet 'Respuestas' not found"**:
1. Abre tu hoja de Google Sheets
2. Verifica que exista una hoja llamada exactamente **"Respuestas"** (con mayúscula R)
3. Si no existe, créala

Si ves el error **"Cannot find folder"**:
1. Verifica que el `FOLDER_PARENT_ID` en el script sea correcto
2. Verifica que tengas permisos para acceder a esa carpeta

