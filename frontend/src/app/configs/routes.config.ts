const routesNames = {
    home: '',
    login: 'login',
    error404: '404',
    register: 'register',
    feedback: 'feedback'
};

export const RoutesConfig: any = {
    routesNames: routesNames,
    routes: {
        register: `/${routesNames.register}`,
        feedback: `/${routesNames.feedback}`,
        home: `/${routesNames.home}`,
        login: `/${routesNames.login}`,
        error404: `/${routesNames.error404}`
    }
};
