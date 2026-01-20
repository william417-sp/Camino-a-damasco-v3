// ============================================
// DATOS DE EVENTOS - FÁCIL DE EDITAR
// ============================================
// 
// INSTRUCCIONES:
// 1. Para actualizar eventos, solo edita este archivo
// 2. No necesitas modificar el HTML ni otros archivos
// 3. Guarda los cambios y recarga la página
//
// ICONOS DISPONIBLES (Font Awesome):
// - fas fa-church (iglesia)
// - fas fa-pray (oración)
// - fas fa-book-reader (libro/estudio)
// - fas fa-music (música)
// - fas fa-users (grupo)
// - fas fa-heart (amor)
// - fas fa-hands-helping (servicio)
// Más iconos en: https://fontawesome.com/icons
//
// ============================================

const eventsData = {
    // ============================================
    // EVENTOS REGULARES (se repiten semanalmente)
    // ============================================
    // Para agregar un evento regular, copia el bloque entre { } y pégalo después del último
    // Para eliminar un evento, simplemente borra todo el bloque { }
    regular: [
        {
            icon: 'fas fa-church',                    // Icono (Font Awesome)
            title: 'Servicio Dominical',               // Título del evento
            time: 'Domingos 10:00 AM - 12:00 PM',      // Horario
            description: 'Servicio principal de adoración y predicación de la Palabra.'  // Descripción
        },
        {
            icon: 'fas fa-pray',
            title: 'Oración e Intercesión',
            time: 'Martes 7:30 PM - 9:00 PM',
            description: 'Tiempo dedicado a la oración y la intercesión por necesidades.'
        },
        {
            icon: 'fas fa-book-reader',
            title: 'Discipulado',
            time: 'Jueves 7:30 PM - 9:00 PM',
            description: 'Estudio bíblico y formación espiritual para todos.'
        }
        // EJEMPLO: Para agregar otro evento regular, descomenta y edita:
        // {
        //     icon: 'fas fa-music',
        //     title: 'Ensayo de Alabanza',
        //     time: 'Sábados 6:00 PM - 8:00 PM',
        //     description: 'Ensayo del equipo de alabanza y adoración.'
        // }
    ],
    
    // ============================================
    // EVENTOS ESPECIALES (eventos únicos con fecha)
    // ============================================
    // Para agregar un evento especial, copia el bloque entre { } y pégalo después del último
    // Para eliminar un evento, simplemente borra todo el bloque { }
    special: [
        {
            image: 'Images/youth-retreat.jpg',         // Ruta de la imagen
            imageAlt: 'Retiro de Jóvenes 2025 - Joven líder explicando a grupo de jóvenes',  // Texto alternativo
            month: 'OCT',                              // Mes (3 letras: ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC)
            day: '15',                                 // Día (número)
            title: 'Retiro de Jóvenes 2025',           // Título del evento
            time: '8:00 AM - 5:00 PM',                 // Horario
            location: 'Centro de Retiros El Yunque',  // Ubicación
            description: 'Un día especial de adoración, compañerismo y actividades para jóvenes. Únete a nosotros para una experiencia transformadora.'
        },
        {
            image: 'Images/worship-concert.jpg',
            imageAlt: 'Concierto de Adoración - Personas adorando con el nombre JESUS',
            month: 'NOV',
            day: '20',
            title: 'Concierto de Adoración',
            time: '7:00 PM - 9:00 PM',
            location: 'Iglesia Camino a Damasco',
            description: 'Una noche especial de adoración y alabanza con invitados especiales. Ven a experimentar la presencia de Dios a través de la música.'
        }
        // EJEMPLO: Para agregar otro evento especial, descomenta y edita:
        // {
        //     image: 'Images/nuevo-evento.jpg',
        //     imageAlt: 'Descripción de la imagen',
        //     month: 'DIC',
        //     day: '25',
        //     title: 'Navidad 2025',
        //     time: '6:00 PM - 9:00 PM',
        //     location: 'Iglesia Camino a Damasco',
        //     description: 'Celebración especial de Navidad con toda la familia.'
        // }
    ]
};
