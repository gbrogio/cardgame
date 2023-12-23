import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import AceEditor from "react-ace";
import { toast } from "react-toastify";
import { Card } from "./card-table";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "one-theme-ace";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "components/ui/select";
import { UploadImageInput } from "components/upload-image-input";
import { useRouter } from "next/navigation";
import { readyCodes } from "./ready-codes";

export const CardForm = ({
	card,
	handleCard,
	cardsIds,
	closeModal,
}: {
	card?: Card;
	handleCard?: (card: Card) => void;
	cardsIds: number[];
	closeModal: () => void;
}) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [code, setCode] = useState(card ? card.rule : "");
	const [file, setFile] = useState<File | null>(null);
	const [idError, setIdError] = useState<boolean>(false);
	const supabase = createClientComponentClient();

	async function uploadImage(id: number, image: File) {
		const fileExt = image.name.split(".").pop();
		const filePath = `${id}.${fileExt}`;

		await supabase.storage.from("cards").upload(filePath, image);
		return [
			supabase.storage.from("cards").getPublicUrl(filePath).data.publicUrl,
			filePath,
		];
	}

	async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();

		if (idError) return toast.warn("Esse Número de carta já está em uso!");

		const {
			receiver_defense,
			receiver_money,
			receiver_justice,
			sender_defense,
			sender_money,
			sender_justice,
			card_number,
			name,
		} = event.target as unknown as {
			[key: string]: { value: string };
		};
		setIsLoading(true);

		const cardValue = {
			id: Number(card_number.value),
			name: name.value,
			rule: code,
			sender: {
				defense: Number(sender_defense.value),
				money: Number(sender_money.value),
				justice: Number(sender_justice.value),
			},
			receiver: {
				defense: Number(receiver_defense.value),
				money: Number(receiver_money.value),
				justice: Number(receiver_justice.value),
			},
		};

		const [image_url, path] = file
			? await uploadImage(cardValue.id, file)
			: [undefined, undefined];

		await supabase
			.from("cards")
			.upsert({
				...cardValue,
				image_url,
				path,
			})
			.select("*")
			.single()
			.then((res) => {
				if (res.error) {
					return toast.error(
						!card
							? "Ocorreu um erro ao criar sua carta! Tente novamente mais tarde."
							: "Ocorreu um erro ao atualizar sua carta! Tente novamente mais tarde.",
					);
				}
				if (handleCard) handleCard(res.data);
				toast.success(
					`Carta ${card ? "atualizada" : "criada"} com sucesso, Nº ${res.data
						?.id}`,
				);
			});
		setIsLoading(false);
		setFile(null);
		router.refresh();
		closeModal();
	}

	return (
		<DialogContent
			handleClickClose={() => {
				setFile(null);
			}}
			className="sm:max-w-[625px] rounded-lg overflow-y-auto py-8 px-6 max-h-[80dvh]"
		>
			<form onSubmit={onSubmit}>
				<DialogHeader>
					<DialogTitle>{card ? "Editar carta" : "Criar carta"}</DialogTitle>
					<DialogDescription>
						Faças as alterações necessárias e então clique em salvar
					</DialogDescription>
				</DialogHeader>
				<Separator className="my-4" />
				<div className="flex flex-col space-y-2">
					<Label className="text-muted-foreground" htmlFor="card_number">
						Número da carta
					</Label>
					<Input
						id="card_number"
						name="card_number"
						defaultValue={card ? card.id : undefined}
						placeholder="Nº"
						type="number"
						required
						className="col-span-3 max-w-[6rem]"
						disabled={!!card || isLoading}
						onChange={({ target: { value } }) => {
							if (cardsIds.includes(Number(value))) setIdError(true);
							else setIdError(false);
						}}
					/>
				</div>
				<div className="flex flex-col space-y-2 mt-4">
					<Label className="text-muted-foreground" htmlFor="name">
						Nome da carta
					</Label>
					<Input
						id="name"
						name="name"
						defaultValue={card ? card.name : undefined}
						placeholder="Carta X"
						required
						className="col-span-3"
						disabled={isLoading}
					/>
				</div>

				<div className="mt-4">
					<UploadImageInput
						file={file || card?.image_url || null}
						handleFile={setFile}
						id="image"
						required={!file && !card?.image_url}
						disabled={isLoading}
					/>
				</div>
				<Separator className="my-4" />
				<div className="flex flex-col space-y-4 mb-8">
					<h2 className="italic font-bold">Pontos para o lançador:</h2>
					<div className="flex flex-col space-y-2">
						<Label className="text-muted-foreground" htmlFor="sender_defense">
							Pontos de Defesa
						</Label>
						<Input
							id="sender_defense"
							name="sender_defense"
							defaultValue={card ? card.sender.defense : 0}
							type="number"
							required
							className="col-span-3"
							disabled={isLoading}
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<Label className="text-muted-foreground" htmlFor="sender_money">
							Saldo
						</Label>
						<Input
							id="sender_money"
							name="sender_money"
							defaultValue={card ? card.sender.money : 0}
							type="number"
							required
							className="col-span-3"
							disabled={isLoading}
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<Label className="text-muted-foreground" htmlFor="sender_justice">
							Pontos de Justiça
						</Label>
						<Input
							id="sender_justice"
							name="sender_justice"
							defaultValue={card ? card.sender.justice : 0}
							type="number"
							className="col-span-3"
							required
							disabled={isLoading}
						/>
					</div>
				</div>
				<div className="flex flex-col space-y-4 mb-8">
					<h2 className="italic font-bold">Pontos para o Destinatário:</h2>
					<div className="flex flex-col space-y-2">
						<Label className="text-muted-foreground" htmlFor="receiver_defense">
							Pontos de Defesa
						</Label>
						<Input
							id="receiver_defense"
							name="receiver_defense"
							defaultValue={card ? card.receiver.defense : 0}
							type="number"
							required
							className="col-span-3"
							disabled={isLoading}
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<Label className="text-muted-foreground" htmlFor="receiver_money">
							Saldo
						</Label>
						<Input
							id="receiver_money"
							name="receiver_money"
							defaultValue={card ? card.receiver.money : 0}
							type="number"
							required
							className="col-span-3"
							disabled={isLoading}
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<Label className="text-muted-foreground" htmlFor="receiver_justice">
							Pontos de Justiça
						</Label>
						<Input
							id="receiver_justice"
							name="receiver_justice"
							defaultValue={card ? card.receiver.justice : 0}
							type="number"
							className="col-span-3"
							required
							disabled={isLoading}
						/>
					</div>
				</div>

				<div className="flex mb-8 flex-col space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="italic font-bold">Regra da carta:</h2>

						<div className="flex flex-col space-y-2">
							<Label className="text-muted-foreground" htmlFor="card_number">
								Tipo de carta
							</Label>
							<Select
								onValueChange={(v) =>
									setCode(readyCodes[Number(v)]?.code || "")
								}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Tipo de carta" />
								</SelectTrigger>
								<SelectContent>
									{readyCodes.map(({ label, value }, i) => (
										<SelectItem key={value} value={`${i}`}>
											{label}
										</SelectItem>
									))}

									<SelectItem value="none">Nenhum</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="w-full">
						<AceEditor
							className="!w-full !h-64 !px-0 !p-2"
							theme="one_dark"
							mode="javascript"
							fontSize="16px"
							highlightActiveLine={true}
							value={code}
							onChange={(c) => setCode(c)}
							setOptions={{
								enableLiveAutocompletion: true,
								showLineNumbers: true,
								tabSize: 2,
							}}
						/>
					</div>
				</div>
				<DialogFooter className="mt-8">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							"Salvar"
						)}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
};
