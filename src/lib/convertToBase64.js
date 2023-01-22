export default function convertToBase64 (file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        if (!file) {
            console.log("No file was get");
        } else {
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
        }
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}