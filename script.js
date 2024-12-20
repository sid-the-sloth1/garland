const str = `{"ends":[{"position":[2,4],"side":"r"},{"position":[4,3],"side":"b"}],"tails":[[null,null,null,{"imageName":"angle_1","rotation":180,"connections":["b","l"]},{"imageName":"angle_2","rotation":90,"connections":["r","b"]}],[{"imageName":"angle_1","rotation":0,"connections":["t","r"]},{"imageName":"angle_2","rotation":180,"connections":["b","l"]},{"imageName":"angle_1","rotation":0,"connections":["t","r"]},{"imageName":"cross","rotation":0,"connections":["t","r","b","l"]},{"imageName":"angle_3","rotation":0,"connections":["t","r"]}],[{"imageName":"angle_4","rotation":90,"connections":["r","b"]},{"imageName":"cross","rotation":0,"connections":["t","r","b","l"]},{"imageName":"cross","rotation":0,"connections":["t","r","b","l"]},{"imageName":"cross","rotation":0,"connections":["t","r","b","l"]},{"imageName":"straight_1","rotation":0,"connections":["r","l"]}],[{"imageName":"angle_1","rotation":0,"connections":["t","r"]},{"imageName":"cross","rotation":0,"connections":["t","r","b","l"]},{"imageName":"angle_3","rotation":0,"connections":["t","r"]},{"imageName":"straight_4","rotation":0,"connections":["r","l"]},null],[{"imageName":"angle_4","rotation":90,"connections":["r","b"]},{"imageName":"angle_3","rotation":270,"connections":["l","t"]},null,{"imageName":"straight_2","rotation":270,"connections":["b","t"]},null]],"userData":{"userStatus":"ok","message":""}}`;


const data = JSON.parse(str);

//create grid
const grid = document.getElementById('grid');
let x = 0;
let y = 0;
for (let i = 0; i < 25; i++) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.setAttribute("ct_garland_xy_info", `x_${x}_y_${y}`);
    grid.appendChild(gridItem);
    y += 1;
    if (y === 5) {
        y = 0;
        x += 1;
    }
}
populateGrid();


function populateGrid() {
    createEnds(data.ends);
    createTails(data.tails);

    //rotate image when clicked
    document.querySelectorAll('.grid-item').forEach((cell) => {
        cell.addEventListener('click', () => {
            if (cell.querySelector('img')) {
                const txt = cell.querySelector('img').getAttribute('style');
                const rotation = parseInt(txt.split('rotate(')[1].split('deg')[0]) + 90;
                cell.querySelector('img').setAttribute('style', `transform: rotate(${rotation}deg)`);
                const connections = getConnection(cell.querySelector('img').getAttribute('src'), rotation);
                const attr = cell.getAttribute('ct_garland_xy_info');
                const a = parseInt(attr.split('x_')[1].split('_')[0]);
                const b = parseInt(attr.split('y_')[1].split('_')[0]);
                //update the changes in data variable(json) which contains info of whole grid
                updateProperty(a,b, {"rotation": rotation, "connections": connections});
            }
        })
    })
}
//get particular cell using x,y position
function getCell(a, b) {
    return document.querySelector(`[ct_garland_xy_info="x_${a}_y_${b}"]`);
}
function createEnds(ends) {
    for (const end of ends) {
        const cell = getCell(end.position[0], end.position[1]);
        cell.classList.add(`end-${getDirectionName(end.side)}`);
    }
}
function getDirectionName(txt) {
    if (txt === "r") return "right";
    if (txt === "l") return "left";
    if (txt === "t") return "top";
    if (txt === "b") return "bottom";
}
function createTails(tails) {
    let x = 0;
    for (const tail of tails) {
        let y = 0;
        for (const cell of tail) {
            if (cell !== null) {
                const cellOfGrid = getCell(x, y);
                cellOfGrid.innerHTML = `<img src="images/${cell.imageName}.png" style="transform: rotate(${cell.rotation}deg)">`;
            }

            y += 1;
            if (y === 5) {
                y = 0;
                x += 1;
            }
        }
    }
}

//get the connections of particular cell. need string of image name and rotation
function getConnection(img, rotation) {
    let rot = rotation;
    if (rot >= 360) {
        while (rot >= 360) {
            rot -= 360;
        }
    }
    const connections = [];
    if (img.includes("angle")) {
        if (rot === 0) {
            connections.push("r");
            connections.push("t");
        } else if (rot === 90) {
            connections.push("b");
            connections.push("r");
        } else if (rot === 180) {
            connections.push("b");
            connections.push("l");
        } else if (rot === 270) {
            connections.push("t");
            connections.push("l");
        }
    } else if (img.includes("cross")) {
        connections.push("t");
        connections.push("r");
        connections.push("b");
        connections.push("l");
    } else if (img.includes("straight")) {
        if (rot === 0 || rot === 180) {
            connections.push("r");
            connections.push("l");
        } else if (rot === 90 || rot === 270) {
            connections.push("t");
            connections.push("b");
        }
    }
    return connections;
}

//update the changes in data variable(json) which contains info of whole grid
function updateProperty(a,b, obj) {
    const cell = data.tails[a][b];
    for (const key in obj) {
        cell[key] = obj[key];
    }
}