constante NOMBRE_DE_CACHE = 'seb-fit-cache-v1' ;
 
constante OFFLINE_URL = './index.html' ;
 
constante ACTIVOS_A_CACHÉ = [
 
  './' ,
  './index.html' ,
  './manifiesto.webmanifest' ,
  './service-worker.js' ,
  './icons/icon-192.png' ,
  './icons/icon-512.png'
];

self.addEventListener ( 'instalar' , evento =
 > {
  evento.waitUntil (​
    cachés abiertos ( NOMBRE_DE_CACHE ). entonces ( caché => cache.addAll ( ACTIVOS_A_CACHE ) ). entonces ( () => self.skipWaiting ( ))
  );
});

self.addEventListener ( 'activar' , evento = >
 {
  evento.waitUntil (​
    almacena en caché las claves (). luego ( cacheNames =>
      promesa ​all (cacheNames.filter ( nombre => nombre !== CACHE_NAME ) .map ( nombre = > caches.delete (nombre ) ))
    ). entonces ( ( ) => self.clients.claim ( ) )
  );
});

self.addEventListener ( 'obtener' , evento = >
 {
  si (evento.solicitud.metodo !== ' GET '
 ) {
    devolver ;
  }

  const requestUrl =
 nueva URL ( evento.solicitud.url ) ; 
  si (requestUrl.origen ! == self.ubicación .origen )
 {
    devolver ;
  }

  evento.respondWith (
​
    buscar ( evento.solicitud )
      . entonces ( respuesta => {
        const cloned = respuesta.clone ()
 ;
        cachés abiertos ( CACHE_NAME ). entonces ( cache => {
          si (respuesta.ok )
 {
            caché puesto ( evento.solicitud , clonado);
          }
        });
        respuesta de retorno ;
      })
      . catch ( () => almacena en caché. match (evento. solicitud ). then ( match => {
        si (coincidencia) {
          partido de vuelta ;
        }
        si (evento.solicitud.modo === ' navegar ' )
 {
          devuelve cachés.match ( OFFLINE_URL )
 ;
        }
        devolver Respuesta.error (
 ) ; 
      }))
  );
});