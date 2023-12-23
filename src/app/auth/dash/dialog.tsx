import { Dialog as RootDialog } from "components/ui/dialog";
import { useState } from "react";
import { CardForm } from "./card-form";

export const Dialog = ({
	children,
	handleCard,
	cardsIds,
	card,
}: BTypes.FCChildren & {
	handleCard: (d: any) => void;
	card?: any;
	cardsIds: number[];
}) => {
	const [open, setOpen] = useState(false);

	return (
		<RootDialog onOpenChange={setOpen} open={open}>
			{children}
			<CardForm
				closeModal={() => setOpen(false)}
				handleCard={handleCard}
				card={card}
				cardsIds={cardsIds}
			/>
		</RootDialog>
	);
};
