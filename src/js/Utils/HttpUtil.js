export default class HttpUtil {
    // 只需要指定访问的API
    static get(url){
        return new Promise((resolve, reject)=>{
            fetch(url)
                .then(response=>{
                    // console.log(response)
                    if(response.ok){
                        return response.json();
                    }else{
                        throw new Error(response.status + " : " +response.statusText);
                    }
                })
                .then(result=>resolve(result))
                .catch(error=>{
                    reject(error);
                })
        });
    }
    // 不仅指定api，还需要从前端传递参数信息过来
    static post(url, data){
        return new Promise((resolve, reject)=>{
            fetch(url,{
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response=>response.json())
            .then(result=>resolve(result))
            .catch(error=>{
                reject(error)
            })
        })
    }
}