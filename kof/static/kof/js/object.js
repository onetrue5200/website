let OBJECTS = []  // store all the objects

// define the object class
export class Object {
    constructor() {
        OBJECTS.push(this);  // add to object list

        this.timedelta = 0;  // time between current frame and last frame
        this.has_call_start = false;  // make sure start() only called once
    }

    start() {  // init the object

    }

    update() { // update every frame(except the first)

    }

    destroy() {  // delete the object
        for (let i in OBJECTS) {
            if (OBJECTS[i] === this) {
                OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}


let last_timestamp;
let OBJECT_FRAME = (timestamp) => {
    for (let object of OBJECTS) {
        if (!object.has_call_start) {
            object.start();
            object.has_call_start = true;
        } else {
            object.timedelta = timestamp - last_timestamp;
            object.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(OBJECT_FRAME);
}
requestAnimationFrame(OBJECT_FRAME);