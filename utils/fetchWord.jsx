export async function fetchRandomWord(){
    const number = 200; // 단어는 200개만 가져오기 
    const url = `http://random-word-api.herokuapp.com/word?number=${number}`;

    try {
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`API 요청 실패: ${res.status}`)
        }
        const data = await res.json();
        return data;
    }catch(err) {
        console.err(`네트워크 또는 기타 오류: ${err}`);
        return []
    }
}