export function getOtherUserId(chatGrpId :string, userid :string) : string {
    const uuidArr = chatGrpId.split(" ")

    if(uuidArr[0] == userid) return uuidArr[1]

    return uuidArr[0]
}