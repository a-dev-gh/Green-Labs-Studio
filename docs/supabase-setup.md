# Supabase Setup Guide — GREENLABS.Studio

**Para Oscar.** Esta guia te lleva paso a paso desde cero hasta tener el sitio funcionando completamente. No necesitas saber programacion — solo copiar, pegar y hacer clic donde se indica.

Si algo da error en cualquier paso, para y enviaselo a Adrian con una captura de pantalla.

---

## Indice

1. [Crear el proyecto en Supabase](#1-crear-el-proyecto-en-supabase)
2. [Copiar tus credenciales](#2-copiar-tus-credenciales)
3. [Configurar las variables de entorno](#3-configurar-las-variables-de-entorno)
4. [Aplicar las migraciones de base de datos](#4-aplicar-las-migraciones-de-base-de-datos)
5. [Subir fotos desde el panel de administracion](#5-subir-fotos-desde-el-panel-de-administracion)
6. [Agregar productos de prueba (opcional)](#6-agregar-productos-de-prueba-opcional)
7. [Crear tu usuario administrador](#7-crear-tu-usuario-administrador)
8. [Probar el carrito de invitado](#8-probar-el-carrito-de-invitado)
9. [Probar inicio de sesion y fusion del carrito](#9-probar-inicio-de-sesion-y-fusion-del-carrito)
10. [Solucion de problemas](#10-solucion-de-problemas)
11. [Referencias](#11-referencias)

---

## 1. Crear el proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y haz clic en **Start your project** (o **Sign In** si ya tienes cuenta).

2. Una vez dentro del dashboard, haz clic en el boton verde **New project**.

3. Completa el formulario:
   - **Name:** `greenlabs-studio` (o como prefieras)
   - **Database Password:** Crea una contrasena fuerte. Guarda esta contrasena en un lugar seguro (por ejemplo, en las notas de tu telefono o en un administrador de contrasenas). La necesitaras si alguna vez conectas herramientas externas.
   - **Region:** Selecciona **South America (Sao Paulo)** o **US East (N. Virginia)**. Cualquiera de las dos es buena para Republica Dominicana — Sao Paulo suele tener menor latencia.
   - **Pricing Plan:** El plan gratuito (Free) es suficiente para empezar.

4. Haz clic en **Create new project**.

5. Supabase tardara aproximadamente **2 minutos** en aprovisionar el proyecto. Veras una pantalla de carga. Espera hasta que desaparezca antes de continuar.

---

## 2. Copiar tus credenciales

Una vez que el proyecto este listo, necesitas dos valores que el sitio usa para conectarse a tu base de datos.

1. En el sidebar izquierdo del dashboard, haz clic en el icono de engranaje **Settings** (al fondo del menu).

2. Dentro de Settings, haz clic en **API** en el submenu.

3. Encontraras dos valores en la seccion **Project API**:

   | Lo que ves en pantalla | Lo que necesitas copiar |
   |---|---|
   | **Project URL** | Empieza con `https://` seguido de letras y numeros |
   | **anon public** (bajo "Project API keys") | Una cadena larga de letras y numeros |

4. Copia estos dos valores. Los usaras en el siguiente paso.

   > **Nota de seguridad:** El `anon public` key es seguro para usar en el sitio web — esta disenado para ser publico. **No compartas** la "service_role" key con nadie; esa no se usa en el sitio.

---

## 3. Configurar las variables de entorno

Las "variables de entorno" son la forma en que el sitio recibe tus credenciales sin que queden grabadas en el codigo fuente.

### En tu computadora (para desarrollo local)

1. En la carpeta raiz del proyecto (donde estan `package.json`, `index.html`, etc.), crea un archivo nuevo llamado exactamente:

   ```
   .env.local
   ```

   > **Importante:** El nombre es `.env.local`, no `.env`. El archivo `.env` ya existe y tiene valores de ejemplo; `.env.local` es donde van tus credenciales reales y nunca se sube a GitHub.

2. Abre `.env.local` con cualquier editor de texto (el Bloc de notas funciona) y pega esto, reemplazando los valores con los que copiaste en el paso anterior:

   ```
   VITE_SUPABASE_URL=https://tuproyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...elvalorcompleto
   VITE_WHATSAPP_NUMBER=18495252430
   ```

   - `VITE_SUPABASE_URL` — el Project URL del paso 2
   - `VITE_SUPABASE_ANON_KEY` — el anon public key del paso 2
   - `VITE_WHATSAPP_NUMBER` — el numero de WhatsApp para ordenes. El valor por defecto es `18495252430`; cambialoo si usas otro numero. (Este valor esta en `src/lib/constants.ts` linea 1 como respaldo si la variable no existe.)

3. Guarda el archivo.

4. Si ya tenias `npm run dev` corriendo, **detienlo** (Ctrl + C en la terminal) y vuelve a ejecutar `npm run dev`. Vite necesita reiniciarse para leer las nuevas variables.

### En Cloudflare (para el sitio en vivo)

Las mismas tres variables deben agregarse en el dashboard de Cloudflare Pages:

1. Ve a tu proyecto en [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecciona el proyecto `greenlabs-studio`
3. Ve a **Settings > Environment Variables**
4. Agrega las tres variables con los mismos nombres y valores

---

## 4. Aplicar las migraciones de base de datos

Las "migraciones" son archivos SQL que crean todas las tablas, reglas de seguridad y funciones que el sitio necesita. Tienes que correrlas en orden, una por una, usando el SQL Editor de Supabase.

### Como abrir el SQL Editor

1. En el sidebar del dashboard de Supabase, haz clic en **SQL Editor** (icono de codigo `<>`).
2. Haz clic en **New query** para abrir un editor en blanco.

### Proceso para cada migracion

Para cada archivo de migracion:

1. Abre el archivo en tu editor de codigo (o pidele a Adrian que te pase el contenido).
2. Selecciona **todo el contenido** del archivo (Ctrl + A).
3. Copialo (Ctrl + C).
4. Pega el contenido en el SQL Editor de Supabase (Ctrl + V).
5. Haz clic en el boton **Run** (o presiona Ctrl + Enter).
6. Revisa el panel de resultados en la parte inferior. Debe decir algo como `Success. No rows returned.`
7. Si ves algun error en rojo, **para** y enviaselo a Adrian con una captura de pantalla antes de continuar.

### Archivos a aplicar, en este orden exacto

**El orden es obligatorio.** Cada migracion depende de la anterior.

| Orden | Archivo | Que hace |
|---|---|---|
| 1 | `supabase/migrations/20260408_001_initial_schema.sql` | Crea todas las tablas: productos, categorias, carrito, ordenes, perfiles, etc. |
| 2 | `supabase/migrations/20260408_002_enable_rls.sql` | Activa la seguridad a nivel de fila (Row-Level Security) en todas las tablas |
| 3 | `supabase/migrations/20260408_003_rls_policies.sql` | Define quien puede leer o escribir en cada tabla |
| 4 | `supabase/migrations/20260413_004_testimonial_user_status.sql` | Agrega columnas de estado y usuario a la tabla de testimonios |
| 5 | `supabase/migrations/20260417_005_guest_cart_session_id.sql` | Habilita el carrito para visitantes sin cuenta (carrito de invitado) |
| 6 | `supabase/migrations/20260417_006_storage_bucket.sql` | Crea el bucket de fotos `greenlabs-images` con permisos de lectura publica y escritura solo para admin |
| 7 | `supabase/migrations/20260417_007_seed_products_services.sql` | Inserta los 4 succulentos iniciales y los 4 paquetes de servicios como filas en la base de datos |

Despues de correr las 7 migraciones, puedes verificar que todo esta bien yendo a **Table Editor** en el sidebar — deberias ver todas las tablas listadas. Para confirmar que el bucket se creo, ve a **Storage** en el sidebar — deberias ver `greenlabs-images` listado.

---

## 5. Subir fotos desde el panel de administracion

La migracion 006 crea el bucket de almacenamiento `greenlabs-images` en Supabase Storage. Este bucket guarda todas las fotos del catalogo y de los servicios. **Las fotos no se suben automaticamente** — las agregas tu desde el panel de administracion del sitio.

### Subir fotos de productos

1. Inicia sesion en el sitio como administrador.
2. Ve a `/admin/productos`.
3. Haz clic en el boton de edicion del producto al que quieres agregarle fotos.
4. En la seccion de fotos del formulario, arrastra las imagenes directamente desde tu computadora o haz clic en el area para seleccionarlas.
5. El sitio acepta archivos JPG, PNG y WEBP de hasta 2MB cada uno. Los archivos JPG/PNG se convierten automaticamente a WEBP al subirse.
6. Puedes agregar hasta 6 fotos por producto y reordenarlas arrastrando las miniaturas.
7. Haz clic en **Guardar** cuando termines.

### Subir fotos de servicios

El proceso es identico, pero desde `/admin/servicios`. Cada servicio acepta una foto principal.

> **Nota:** Los productos sembrados por la migracion 007 tienen el campo de fotos vacio al inicio. El sitio muestra un placeholder hasta que subes la primera foto real.

---

## 6. Agregar productos de prueba (opcional)

Hay un archivo `supabase/seed.sql` con datos de ejemplo (productos, categorias, etc.) que puedes usar para probar el sitio antes de agregar tu catalogo real.

Para cargarlo:

1. Abre `supabase/seed.sql` en tu editor, copia todo el contenido.
2. Pega en el SQL Editor de Supabase y haz clic en **Run**.

Si prefieres no usar datos de prueba, puedes agregar tus productos directamente desde la seccion `/admin/productos` del sitio, una vez que hayas creado tu usuario administrador (paso siguiente).

---

## 7. Crear tu usuario administrador

El sitio tiene dos tipos de usuarios: `user` (clientes normales) y `admin` (tu — acceso completo al panel de administracion). Por defecto, todos los usuarios nuevos son `user`. Necesitas crear tu cuenta y luego ascenderla a `admin`.

### Paso A: Crear la cuenta

1. En el sidebar de Supabase, ve a **Authentication** > **Users**.
2. Haz clic en **Invite user**.
3. Escribe tu correo electronico y haz clic en **Send invitation**.
4. Revisa tu bandeja de entrada — llegara un correo de Supabase con un enlace para establecer tu contrasena.
5. Haz clic en el enlace del correo y elige una contrasena segura.

### Paso B: Buscar tu ID de usuario

1. Regresa al dashboard de Supabase > **Authentication** > **Users**.
2. Busca tu correo en la lista. En la columna **UID** veras un codigo largo como este: `a1b2c3d4-e5f6-...`
3. Copia ese codigo completo.

### Paso C: Asignarte el rol de admin

1. Ve a **SQL Editor** > **New query**.
2. Pega la siguiente consulta, reemplazando el UUID con el tuyo:

   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE id = 'pega-aqui-tu-uuid';
   ```

   Ejemplo con un UUID real:
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
   ```

3. Haz clic en **Run**. El resultado debe decir `Success. 1 row affected` (o similar). Si dice `0 rows affected`, significa que el perfil no se creo automaticamente — avisale a Adrian.

### Paso D: Verificar acceso admin

1. Ve al sitio en tu navegador.
2. Inicia sesion con el correo y contrasena que creaste.
3. Navega a `/admin`. Deberias ver el panel de administracion con todas las secciones: Productos, Categorias, Testimonios, etc.

   Si ves un error de "acceso no autorizado" o la pagina en blanco, confirma que el UPDATE del paso C devolvio 1 fila afectada.

---

## 8. Probar el carrito de invitado

Esta prueba confirma que cualquier visitante puede comprar sin necesidad de crear una cuenta.

1. Abre el sitio en una **ventana de incognito** (Ctrl + Shift + N en Chrome/Edge).
2. Navega al catalogo y agrega al menos un suculento al carrito.
3. Para confirmar que el carrito de invitado esta funcionando:
   - Abre las herramientas de desarrollador del navegador (F12 o clic derecho > Inspeccionar).
   - Ve a la pestana **Application** (en Chrome) o **Storage** (en Firefox).
   - En el panel izquierdo busca **Local Storage** > el URL del sitio.
   - Deberias ver una clave llamada `greenlabs:guest_session_id` con un valor UUID.
4. Ve a `/carrito` y haz clic en **Ordenar por WhatsApp**.
5. Debe abrirse WhatsApp con un mensaje pre-llenado con los productos del carrito. No se debe pedir inicio de sesion en ningun momento.

Si WhatsApp no abre o el carrito aparece vacio, es probable que la migracion 005 no se aplico correctamente.

---

## 9. Probar inicio de sesion y fusion del carrito

Esta prueba confirma que cuando un invitado inicia sesion, sus productos no se pierden.

1. En la misma ventana de incognito del paso anterior (o abre una nueva):
2. Agrega un suculento al carrito **sin** iniciar sesion. Anota cual es y la cantidad.
3. Inicia sesion con tu cuenta de admin (o crea una cuenta de cliente de prueba).
4. Despues de iniciar sesion, ve a `/carrito`.
5. El producto que agregaste como invitado debe seguir ahi, combinado con cualquier item que ya tuvieras en la cuenta.

Si el carrito aparece vacio despues del login, revisa que la migracion 005 incluia la funcion `merge_guest_cart`. Avisa a Adrian si el problema persiste.

---

## 10. Solucion de problemas

| Sintoma | Causa probable | Que hacer |
|---|---|---|
| El carrito no carga / errores 404 en el carrito | La migracion 005 no fue aplicada | Vuelve al paso 4 y aplica `20260417_005_guest_cart_session_id.sql` |
| "new row violates row-level security policy" | La migracion 003 no fue aplicada, o el perfil de usuario no se creo automaticamente | Verifica que aplicaste las migraciones en orden. Si el problema es el perfil, avisa a Adrian. |
| Pagina en blanco despues de iniciar sesion | Las variables de entorno no estan configuradas o Vite no las cargo | Revisa el archivo `.env.local`, asegurate de que los valores son correctos, y reinicia `npm run dev`. Abre la consola del navegador (F12) para ver el error exacto. |
| El panel `/admin` dice "no autorizado" | Tu usuario no tiene `role = 'admin'` | Repite el paso 7C con tu UUID correcto. |
| El correo de invitacion no llega | El correo puede estar en spam | Revisa la carpeta de spam. Si no llega en 5 minutos, en Supabase > Authentication > Users haz clic en los tres puntos junto a tu usuario y selecciona "Send password recovery". |
| "0 rows affected" en el UPDATE del rol | El perfil no se creo en la tabla `profiles` | Esto significa que el trigger `on_auth_user_created` no corrio. Avisa a Adrian con una captura del error. |
| Subi una foto pero no aparece en el sitio | El bucket no esta configurado correctamente o la URL no se guardo en la base de datos | Revisa en el dashboard de Supabase: ve a **Storage** y confirma que el bucket `greenlabs-images` existe y que la columna **Public** dice `true`. Luego ve a **Table Editor** > tabla `products` y confirma que el campo `images` de ese producto contiene la URL publica completa de la foto (debe empezar con `https://`). Si el array esta vacio, edita el producto desde `/admin/productos` y vuelve a subir la foto. Si el problema persiste, avisa a Adrian con una captura de la seccion Storage del dashboard. |

---

## 11. Referencias

- **Diseno de la base de datos y carrito de invitado:** `docs/architecture.md` — seccion 11
- **Modelos de datos (todas las tablas y columnas):** `docs/data-models.md`
- **Tu dashboard de Supabase:** `https://supabase.com/dashboard/project/<tu-project-ref>`
  (Reemplaza `<tu-project-ref>` con el codigo corto de tu proyecto — lo ves en la URL cuando estas en el dashboard, por ejemplo `abcdefghijklmnop`)

---

*Guia preparada por Adrian Alexander — Axiom Studio.*
*Para soporte: envia tu captura de pantalla con el error al chat de Adrian.*
