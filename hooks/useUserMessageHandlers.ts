import {useDispatch} from "react-redux";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserEmojiStatus, UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";
import {useCallback} from "react";
import mqttService, {MqttActionType} from "@/services/mqttService";
import {updateUserConnectedDeviceCount, updateUserEmojiStatus, updateUserStatus} from "@/store/slice/userSlice";
import {undefined} from "zod";

export const useUserMessageHandlers = () => {
    const dispatch = useDispatch()

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const handleUserEmojiMessage = useCallback(
        (messageStr: string) => {

            try {

                const mqttUserEmoji = mqttService.parseUserEmojiStatusMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttUserEmoji.data.user_uuid) return


                switch (mqttUserEmoji.data.type) {

                    case MqttActionType.Update:

                        dispatch(updateUserEmojiStatus({
                            userUUID: mqttUserEmoji.data.user_uuid,
                            status: mqttUserEmoji.data.user_emoji_status
                        }))

                        break

                    case MqttActionType.Delete:

                        dispatch(updateUserEmojiStatus({
                            userUUID: mqttUserEmoji.data.user_uuid,
                            status: {} as UserEmojiStatus
                        }))

                        break

                    default:
                        console.warn("[MQTT] Unknown user emoji action type:", mqttUserEmoji.data.type)
                }


            } catch (error) {
                console.error("[MQTT] User emoji message handling error:", error)
            }

        },
        [dispatch],
    )

    const handleUserStatusMessage = useCallback(

        (messageStr: string) => {

            const mqttUserEmoji = mqttService.parseUserStatusMsg(messageStr)

            if(selfProfile.data?.data.user_uuid == mqttUserEmoji.data.user_uuid) return

            try {

                switch (mqttUserEmoji.data.type) {

                    case MqttActionType.Update:

                        dispatch(updateUserStatus({
                            userUUID: mqttUserEmoji.data.user_uuid,
                            status: mqttUserEmoji.data.user_status
                        }))

                        break


                    default:
                        console.warn("[MQTT] Unknown user status action type:", mqttUserEmoji.data.type)

                }

                } catch (error) {
                console.error("[MQTT] User status handling error:", error)
            }

        },
        [dispatch],

    )

    const handleUserDeviceConnectedMessage = useCallback(
        (messageStr: string) => {

            try {

                const mqttUserDevice = mqttService.parseUserDeviceMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttUserDevice.data.user_uuid) return

                switch (mqttUserDevice.data.type) {

                    case MqttActionType.Update:

                        dispatch(updateUserConnectedDeviceCount({
                            userUUID: mqttUserDevice.data.user_uuid,
                            deviceConnected: mqttUserDevice.data.user_device_connected
                        }))

                        break

                    default:
                        console.warn("[MQTT] Unknown user device connected action type:", mqttUserDevice.data.type)

                }

            }  catch (error) {
                console.error("[MQTT] User device connected handling error:", error)
            }
        },
        [dispatch],
    )

    return {
        handleUserEmojiMessage,
        handleUserStatusMessage,
        handleUserDeviceConnectedMessage
    }
}