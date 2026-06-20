export const getRandomBG = () => {
    const colors = ["#f6b100", "#e63946", "#2e4a40", "#100ce086", "#2e86ab", "#ff6f91", "#845ec2"];
    return colors[Math.floor(Math.random() * colors.length)]; 
}

export const getBgColor = () => {
    const bgarr = [
        "#F4B400",
        "#7ED957",
        "#FF8A3D",
        "#FF5A5F",
        "#FF7043",
        "#C58B4E",
        "#3B82F6",
        "#C084FC",
    ]
    const randomBg = Math.floor(Math.random() * bgarr.length);
    const color = bgarr[randomBg];
    return color;
}

export const getAvatarName = (name) => {
    if(!name) return "";

    return name.split(" ").map(word => word[0]).join("").toUpperCase();
}

export const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
 };