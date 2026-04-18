export function random(len: number) {
    let option = ";dijgdhusajiargj80fgio321646131";
    let length = option.length
    let ans = ""

    for (let i = 0; i < len; i++) {
        ans += option[Math.floor((Math.random() * length))]
    }
    return ans;
}