import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

import {useEffect, useState} from "react";

import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "../ui/dialog";

import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Separator} from "../ui/separator";
import {Trash} from "lucide-react";
import {AppLanguageCombobox} from "@/components/dialog/appLanguageCombobox";
import {useFetchOnlyOnce, useMediaFetch} from "@/hooks/useFetch";
import {USER_STATUS_OFFLINE, USER_STATUS_ONLINE, UserProfileInterface, UserProfileUpdateInterface} from "@/types/user";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {GetMediaURLRes} from "@/types/file";
import {useUploadFile} from "@/hooks/useUploadFile";
import {usePost} from "@/hooks/usePost";
import {useTranslation} from "react-i18next";
import {Switch} from "@/components/ui/switch";
import {useDispatch} from "react-redux";
import {updateUserInfoStatus} from "@/store/slice/userSlice";

const profileFormSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(4, "Full name must be at least 4 characters")
        .max(30, "Full name must be at most 30 characters")
        .regex(/^[A-Za-z0-9_\s]+$/, "Full name must only contain letters, numbers, and underscores")
        .transform((e) => (e === "" ? undefined : e)),
    displayName: z
        .string()
        .trim()
        .min(4, "Display name must be at least 4 characters")
        .max(30, "Display name must be at most 30 characters")
        .regex(/^[A-Za-z0-9_\s]+$/, "Display name must only contain letters, numbers, and underscores")
        .transform((e) => (e === "" ? undefined : e)),
    jobTitle: z
        .union([z.string().length(0), z.string().min(4).max(30)])
        .optional()
        .transform((e) => (e === "" ? undefined : e)),
    hobbies: z
        .union([z.string().length(0), z.string().min(4).max(30)])
        .optional()
        .transform((e) => (e === "" ? undefined : e)),
    language: z.string({
        required_error: "Please select a language.",
    }),
    status: z.boolean({})
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface editProfileDialogProps {
    dialogOpenState: boolean;
    setOpenState: (state: boolean) => void;
}

const EditProfileDialog: React.FC<editProfileDialogProps> = ({
                                                                 dialogOpenState,
                                                                 setOpenState,
                                                             }) => {
    const profileInfo = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const profileImageRes = useMediaFetch<GetMediaURLRes>(profileInfo && profileInfo.data?.data.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+profileInfo.data.data.user_profile_object_key : '');

    const [selectedImage, setSelectedImage] = useState<string>("");
    const [selectedImageFile, selectedImageSetFile] = useState<FileList | null>(null);
    const uploadFile = useUploadFile()
    const post = usePost()
    const {t} = useTranslation()

    const dispatch = useDispatch()

    useEffect(() => {
        if (profileImageRes.data?.url) {
            setSelectedImage(profileImageRes.data.url);
        }
    }, [profileImageRes.data]);

    useEffect(() => {
        if (profileInfo.data?.data) {
            const defaultValues: Partial<ProfileFormValues> = {
                fullName: profileInfo.data?.data.user_full_name || "",
                jobTitle: profileInfo.data?.data.user_job_title || "",
                displayName: profileInfo.data?.data.user_name || "",
                language: profileInfo.data?.data.user_app_lang || "en",
                hobbies: profileInfo.data?.data.user_hobbies || "",
                status: profileInfo.data?.data.user_status == USER_STATUS_ONLINE || false
            };
            form.reset(defaultValues);
        }
    }, [profileInfo.data]);


    const removeImage = () => {
        setSelectedImage("");
        selectedImageSetFile(null);
    };

    const onSubmit = async (data: ProfileFormValues) => {
        let profileKey = profileInfo.data?.data.user_profile_object_key || "";

        if (selectedImage == "" && selectedImageFile == null) {
            profileKey = "";
        }
        if (selectedImageFile) {

            const responses = await uploadFile.makeRequestToUploadToPublic(selectedImageFile)
            if (responses.length > 0) {
                profileKey = responses[0].object_uuid
            }


        }


            post.makeRequest<UserProfileUpdateInterface>({
                payload: {
                    user_name: data.displayName || profileInfo.data?.data.user_name || "",
                    user_full_name: data.fullName || profileInfo.data?.data.user_full_name || "",
                    user_job_title:
                        data.jobTitle || profileInfo.data?.data.user_job_title || "",
                    user_profile_object_key: profileKey,
                    user_app_lang:
                        data.language || profileInfo.data?.data.user_app_lang || "en",
                    user_hobbies: data.hobbies || profileInfo.data?.data.user_hobbies || "",
                    user_status: data.status ? USER_STATUS_ONLINE : USER_STATUS_OFFLINE
                },
                apiEndpoint: PostEndpointUrl.UpdateUserProfile

            }).then(()=>{
                dispatch(updateUserInfoStatus({
                    userUUID: profileInfo.data?.data.user_uuid || '',
                    profileKey: profileKey,
                    userName: data.displayName || profileInfo.data?.data.user_name || "",
                    status: data.status ? USER_STATUS_ONLINE : USER_STATUS_OFFLINE

                }))
                profileInfo.mutate({
                    mag: profileInfo.data?.mag || '',
                    ...profileInfo.data,
                    data: {
                        ...profileInfo.data?.data,
                        user_uuid: profileInfo.data?.data.user_uuid || '',
                        user_name: data.displayName || profileInfo.data?.data.user_name || "",
                        user_full_name: data.fullName || profileInfo.data?.data.user_full_name || "",
                        user_job_title:
                            data.jobTitle || profileInfo.data?.data.user_job_title || "",
                        user_profile_object_key: profileKey,
                        user_app_lang:
                            data.language || profileInfo.data?.data.user_app_lang || "en",
                        user_hobbies: data.hobbies || profileInfo.data?.data.user_hobbies || "",
                        user_status: data.status ? USER_STATUS_ONLINE : USER_STATUS_OFFLINE

                    }
                }, false)
            })




        // profileInfo.mutate();

        closeModal(); // Close dialog after submission
    };

    function closeModal() {
        setOpenState(false);
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataURL = reader.result as string;
                setSelectedImage(imageDataURL);
            };
            reader.readAsDataURL(file);
            selectedImageSetFile(event.target.files);
        }
    };

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: "onChange",
    });

    const nameIntialsArray = profileInfo.data?.data.user_name.split(" ") || [
        "Unknown",
    ];

    let nameIntial = nameIntialsArray[0][0].toUpperCase();

    if (nameIntialsArray?.length > 1) {
        nameIntial += nameIntialsArray[1][0].toUpperCase();
    }

    return (
        <Dialog onOpenChange={closeModal} open={dialogOpenState}>
            {/*<DialogTrigger asChild>*/}
            {/*    <Button variant="secondary">Save</Button>*/}
            {/*</DialogTrigger>*/}
            <DialogContent className="sm:max-w-fit">
                <DialogHeader>
                    <DialogTitle>{t('profile')}</DialogTitle>
                    <DialogDescription>{t('editProfile')}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-row ">
                    <div className="flex flex-col justify-center items-center h-full mr-12">
                        <div className="flex relative justify-center items-center mb-3">
                            <Avatar className="h-48 w-48">
                                <AvatarImage src={selectedImage || undefined} alt="Profile Image" />
                                <AvatarFallback>{nameIntial}</AvatarFallback>
                            </Avatar>
                            <div className="h-48 w-48 absolute flex justify-center items-center bg-black/30 bg-opacity-50 rounded-full opacity-0 hover:opacity-100">
                                <label
                                    htmlFor="imageUpload"
                                    className="h-full w-full flex justify-center items-center cursor-pointer"
                                >
                                    <div className="rounded-lg text-white text-sm font-bold">
                                        {t('edit')}
                                    </div>
                                </label>
                            </div>
                            <Input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                        {selectedImage && (
                            <Button variant="outline" className="mb-2" size={'sm'} onClick={removeImage}>
                                <Trash className="h-4 w-4 " />{t('removeImage')}
                            </Button>
                        )}

                        <div className="text-center">
                            {profileInfo.data?.data.user_name}
                        </div>
                        <div className="text-muted-foreground">
                            {profileInfo.data?.data.user_email_id}
                        </div>
                    </div>

                    <Separator orientation="vertical" className="mx-2 " />

                    <div className="ml-12 mr-2">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{('Full Name')}</FormLabel>
                                            <FormControl>
                                                <Input {...field} className='shadow-none'/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="displayName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{('Display Name')}</FormLabel>
                                            <FormControl>
                                                <Input {...field} className='shadow-none'/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jobTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('jobTitle')}</FormLabel>
                                            <FormControl>
                                                <Input {...field} className='shadow-none'/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hobbies"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{('Hobbies')}</FormLabel>
                                            <FormControl>
                                                <Input {...field} className='shadow-none' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>{t('language')}</FormLabel>
                                            <AppLanguageCombobox
                                                onLangChange={field.onChange}
                                                userLang={field.value}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>{t('onlineLabel')}</FormLabel>
                                            <Switch
                                                id="status"
                                                checked={!!field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button disabled={uploadFile.isSubmitting || post.isSubmitting} type="submit">{('update')}</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileDialog;
