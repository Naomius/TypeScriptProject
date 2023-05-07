export type RouteType = {
    route: string,
    title: string,
    template: string,
    styles: string,
    scripts?: string
    load(): void
}