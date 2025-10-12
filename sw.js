constante NOMBRE_DE_CACHE = 'fittrack-static-v1' ;
 
constante APP_SHELL = [
 
  './' ,
  './index.html' ,
  './manifiesto.json' ,
  './icons/icono-192x192.png' ,
  './icons/icono-512x512.png'
];

self.addEventListener ( 'instalar' , evento =
 > {
  evento.waitUntil (​
    cachés abiertos ( CACHE_NAME ). luego ( cache => cache.addAll ( APP_SHELL )
 )
  );
  yo mismo.skipEsperando ( ) ;
});

self.addEventListener ( 'activar' , evento = >
 {
  evento.waitUntil (​
    almacena en caché las claves (). luego ( claves =>
      Promesa . todo (
        llaves.map ( clave = > {
          si (clave !== NOMBRE_DE_CACHE ) {
            devolver caches.delete (clave)
 ;
          }
          devolver indefinido ;
 
        })
      )
    )
  );
  yo.clientes.reclamo (
 ) ;​
});

self.addEventListener ( 'obtener' , evento = >
 {
  si (evento.solicitud.metodo !== ' GET '
 ) {
    devolver ;
  }

  const requestUrl =
 nueva URL ( evento.solicitud.url ) ; 

  si ( requestUrl.origen === self.ubicación.origen )
 {​
    si ( requestUrl.pathname === '/' || requestUrl.pathname.endsWith ( ' .html ' ))
 {
      evento responderCon ( redPrimero (evento.solicitud ))
 ;
      devolver ;
    }
    evento responderWith ( cacheFirst (evento.solicitud ) );
    devolver ;
  }

  // Para solicitudes de origen cruzado (por ejemplo, CDN), utilice una estrategia de "obsoleto mientras se revalida".
  evento responderWith ( staleWhileRevalidate (evento.solicitud ) );
});

función asíncrona cacheFirst ( solicitud ) {
  
  const cache = await caches.open ( CACHE_NAME )
 ;
  const cachedResponse = await cache.match (solicitud)
 ;
  si (respuesta en caché) {
    devolver cachedResponse;
  }
  const respuesta = await fetch (solicitud);
 
  si (respuesta && respuesta.estado === 200 ) {
    caché put (solicitud,respuesta.clonar () ) ;
  }
  respuesta de retorno ;
}

función asíncrona networkFirst ( solicitud ) {
  
  const cache = await caches.open ( CACHE_NAME )
 ;
  intentar {
    const respuesta = await fetch (solicitud);
 
    si (respuesta && respuesta.estado === 200 ) {
      caché put (solicitud,respuesta.clonar () ) ;
    }
    respuesta de retorno ;
  } captura (error) {
    const cachedResponse = await cache.match (solicitud)
 ;
    si (respuesta en caché) {
      devolver cachedResponse;
    }
    arrojar error;
  }
}

función asíncrona staleWhileRevalidate ( solicitud ) {
  
  const cache = await caches.open ( CACHE_NAME )
 ;
  const cachedResponse = await cache.match (solicitud)
 ;
  const networkPromise = fetch (solicitud)
    . entonces ( respuesta => {
      si (respuesta && respuesta.estado === 200 ) {
        caché put (solicitud,respuesta.clonar () ) ;
      }
      respuesta de retorno ;
    })
    . catch ( () => cachedResponse);

  devolver cachedResponse || networkPromise;
}
