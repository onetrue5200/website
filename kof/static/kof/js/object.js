let OBJECTS = []  // store all the objects

// define the object class
export class Object {
    constructor() {
        OBJECTS.push(this);  // add to object list

        this.timedelta = 0;  // time between current frame and last frame
        this.has_call_start = false;  // make sure start() only called once
        this.uuid = this.create_uuid();  // create uuid
    }

    create_uuid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
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