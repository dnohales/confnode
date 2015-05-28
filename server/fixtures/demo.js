noDemoFixtureManager = {
    run: function() {
        var users = {};

        users.admin = Accounts.createUser({
            username: 'admin',
            email: 'admin@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Lisandro Nohappolis',
                company: 'conf.node inc.',
                about: '',
                skills: [],
                interests: [],
                location: 'Buenos Aires, Argentina',
                timezone: 'America/Argentina/Buenos_Aires',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
            }
        });

        users.lisandrofalconi = Accounts.createUser({
            username: 'lisandrofalconi',
            email: 'lisandrofalconi@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Lisandro Falconi',
                company: '',
                about: '',
                skills: ['javascript', 'front-end', 'dev', 'ux'], // Used on interested users recommendation
                interests: ['mongo', 'web', 'ember', 'aws', 'devops'], // Used on interested users recommendation
                location: 'Roma, Italia',
                timezone: 'Europe/Rome',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                ],
                visitedRooms: new Array(150 + 1).join('0').split('')
            }
        });

        users.damiannohales = Accounts.createUser({
            username: 'damiannohales',
            email: 'damiannohales@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Damián Nohales',
                company: '',
                about: '',
                skills: [],
                interests: [],
                location: 'Madrid, España',
                timezone: 'Europe/Madrid',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                ],
            }
        });

        users.emilianolippolis = Accounts.createUser({
            username: 'emilianolippolis',
            email: 'emilianolippolis@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Emiliano Lippolis',
                company: '',
                about: '',
                skills: ['node', 'db', 'nosql', 'ms', 'linux', 'mobile'], // Used on interested users recommendation
                interests: ['back', 'javascript'], // Used on interested users recommendation
                location: 'Atenas, Grecia',
                timezone: 'Europe/Athens',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
                visitedRooms: new Array(30 + 1).join('0').split('')
            }
        });

        users.gabrielverdi = Accounts.createUser({
            username: 'gabrielverdi',
            email: 'gabrielverdi@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Gabriel Verdi',
                company: '',
                about: '',
                skills: [],
                interests: ['mongo', 'node'],
                location: 'Tokyo, Japón',
                timezone: 'Asia/Tokyo',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
                visitedRooms: new Array(70 + 1).join('0').split('')
            }
        });

        users.mikelarbide = Accounts.createUser({
            username: 'mikelarbide',
            email: 'mikelarbide@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Mikel Arbide',
                company: '',
                about: '',
                skills: [],
                interests: [],
                location: 'Kinsasa, República Democrática del Congo',
                timezone: 'Africa/Ndjamena',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
            }
        });

        users.federicomazzini = Accounts.createUser({
            username: 'federicomazzini',
            email: 'federicomazzini@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Federico Mazzini',
                company: '',
                about: '',
                skills: [],
                interests: [],
                location: 'Auckland, Nueva Zelandia',
                timezone: 'Pacific/Auckland',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
            }
        });

        users.juanfernandez = Accounts.createUser({
            username: 'juanfernandez',
            email: 'juanfernandez@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Federico Mazzini',
                company: '',
                about: '',
                skills: [],
                interests: [],
                location: 'Buenos Aires, Argentina',
                timezone: 'America/Argentina/Buenos_Aires',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
            }
        });

        users.johnsmith = Accounts.createUser({
            username: 'johnsmith',
            email: 'johnsmith@confnode.com',
            password: '1234',
            profile: {
                fullname: 'John Smith',
                company: '',
                about: '',
                skills: [],
                interests: [],
                location: 'New York, Estados Unidos',
                timezone: 'America/New_York',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
            }
        });

        users.maryjohansson = Accounts.createUser({
            username: 'maryjohansson',
            email: 'maryjohansson@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Mary Johansson',
                company: '',
                about: '',
                skills: [],
                interests: [],
                location: 'Malmö, Suecia',
                timezone: 'Europe/Stockholm',
                availability: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                ],
            }
        });

        this.generateRoom(users.admin, {
            submittedTime: new Date("December 17, 2014 14:24:00"),
            name: 'Room 1',
            description: 'Room 1 description',
            tags: [],
            guests: [],
            listed: true,
            public: true,
            scheduled: false,
            scheduledTime: null,
            chat: true
        });


        var roomsExpert = [{
            //user1
            submittedTime: new Date("March 17, 2015 14:24:00"),
            name: 'Demo room 1',
            tags: ['mongodb', 'nosql', 'db', 'storage' , 'json', 'aws'],
            visits: 150,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 4,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user1
            submittedTime: new Date("January 1, 2015 14:24:00"),
            name: 'Demo room 2',
            tags: ['mongodb', 'js', 'node', 'web', 'dev', 'angular'],
            visits: 200,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 4,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user1
            submittedTime: new Date("April 1, 2015 14:24:00"),
            name: 'Demo room 3',
            tags: ['js', 'back-end', 'web', 'node', 'fullstack', 'html5', 'css3'],
            visits: 50,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 4,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user2
            submittedTime: new Date("February 10, 2015 14:24:00"),
            name: 'Demo room 4',
            tags: ['java', 'javascript', 'node', 'db', 'front-end', 'mongodb', 'back-end'],
            visits: 150,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 3.5,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user2
            submittedTime: new Date("January 1, 2015 14:24:00"),
            name: 'Demo room 5',
            tags: ['mongodb', 'js', 'node', 'web', 'dev', 'npm', 'git'],
            visits: 200,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 3.5,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user2
            submittedTime: new Date("April 15, 2015 14:24:00"),
            name: 'Demo room 6',
            tags: ['js', 'back-end', 'web', 'node'],
            visits: 50,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 3.5,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user3
            submittedTime: new Date("December 10, 2014 14:24:00"),
            name: 'Demo room 7',
            tags: ['java', 'javascript', 'node', 'db', 'front-end'],
            visits: 250,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 3,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user3
            submittedTime: new Date("January 20, 2015 14:24:00"),
            name: 'Demo room 8',
            tags: ['mongodb', 'js', 'node', 'web', 'dev'],
            visits: 70,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 3,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user3
            submittedTime: new Date("May 1, 2015 14:24:00"),
            name: 'Demo room 9',
            tags: ['js', 'back-end', 'web', 'node'],
            visits: 15,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 3,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user4
            submittedTime: new Date("November 7, 2014 14:24:00"),
            name: 'Demo room 10',
            tags: ['java', 'angular', 'node', 'front-end'],
            visits: 50,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 4.5,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user4
            submittedTime: new Date("April 20, 2015 14:24:00"),
            name: 'Demo room 11',
            tags: ['mongodb', 'js', 'node', 'web', 'dev'],
            visits: 100,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 4.5,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }, {
            //user4
            submittedTime: new Date("March 1, 2015 14:24:00"),
            name: 'Demo room 12',
            tags: ['js', 'back-end', 'web', 'node', 'db'],
            visits: 150,
            feelings: [{
                "user_id": "HPoNgLPMv2iCwRnSQ",
                "rating": 4.5,
                "comment": "Prueba",
                "dateRate": 1431210098696
            }]
        }];
        //User 1
        this.generateRoom(users.juanfernandez, roomsExpert[0]);
        this.generateRoom(users.juanfernandez, roomsExpert[1]);
        this.generateRoom(users.juanfernandez, roomsExpert[2]);
        //User 2
        this.generateRoom(users.johnsmith, roomsExpert[3]);
        this.generateRoom(users.johnsmith, roomsExpert[4]);
        this.generateRoom(users.johnsmith, roomsExpert[5]);
        //User 3
        this.generateRoom(users.maryjohansson, roomsExpert[6]);
        this.generateRoom(users.maryjohansson, roomsExpert[7]);
        this.generateRoom(users.maryjohansson, roomsExpert[8]);
        //User 4
        this.generateRoom(users.mikelarbide, roomsExpert[9]);
        this.generateRoom(users.mikelarbide, roomsExpert[10]);
        this.generateRoom(users.mikelarbide, roomsExpert[11]);
    },

    generateRoom: function(ownerId, room) {
        var user = Meteor.users.findOne({
            _id: ownerId
        });

        return Rooms.insert(_.extend({
                creatorId: user._id,
                creatorEmail: user.emails[0].address,
                creatorName: user.username,
                description: 'Demo room description',
                guests: [],
                listed: true,
                public: true,
                scheduled: false,
                scheduledTime: null,
                chat: true,
            },
            room
        ));
    }
};