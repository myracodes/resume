export function closeOnClickOutside(event: any, element: any): boolean {
    let clickedComponent = event.target;
    let inside = false;

    do {
        if (clickedComponent === element) {
            inside = true;
        }
        clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    return !inside;
}
