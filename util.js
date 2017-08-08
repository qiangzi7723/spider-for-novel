const toNumber=require('./chinese2number.js');
module.exports = {
    format(str){
        const arr=str.split('');
        const index=arr.indexOf('第');
        if(index>1){
            // 说明章节前存在其他文字 如 '限免 第123章'
            for(let i=0,len=index;i<len;i++){
                arr[i]='';
            }
        }
        return arr.join('');
    },
    transform(str){
        try{
            const chinese=str.split('第')[1].split('章')[0];
            return toNumber(chinese);
        }catch(e){
            return false;
        }
    }
};