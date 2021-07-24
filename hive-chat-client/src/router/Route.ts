import { Component } from "vue";
import { RouteConfig } from "vue-router";

export default class Route {

    component?: Component;
    path!: string;
    props = false
    name?: string;

    constructor(path: string, component?: Component) {
        this.path = path;
        this.component = component;
    }
    static withPath(path: string, component?: Component) : Route {
        return new Route(path, component);
    }

    withName(name: string): Route {
        this.name = name;
        return this;
    }

    withProps(): Route {
        this.props = true;
        return this;
    }

    build(): RouteConfig {
        return this as RouteConfig;
    }
}