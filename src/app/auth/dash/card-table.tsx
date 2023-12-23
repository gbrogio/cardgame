"use client";

import {
	CellContext,
	ColumnDef,
	ColumnFiltersState,
	Row,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pen, Plus, Trash } from "lucide-react";
import * as React from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { DialogTrigger } from "components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Input } from "components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CardForm } from "./card-form";
import { Dialog } from "./dialog";

export type Card = {
	id: number;
	image_url: string;
	name: string;
	rule: string;
	sender: {
		defense: number;
		justice: number;
		money: number;
	};
	receiver: {
		defense: number;
		justice: number;
		money: number;
	};
};

export const columns: ColumnDef<Card>[] = [
	// {
	//   id: 'select',
	//   header: ({ table }) => (
	//     <Checkbox
	//       checked={
	//         table.getIsAllPageRowsSelected() ||
	//         (table.getIsSomePageRowsSelected() && 'indeterminate')
	//       }
	//       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	//       aria-label="Select all"
	//     />
	//   ),
	//   cell: ({ row }) => (
	//     <Checkbox
	//       checked={row.getIsSelected()}
	//       onCheckedChange={(value) => row.toggleSelected(!!value)}
	//       aria-label="Select row"
	//     />
	//   ),
	//   enableSorting: false,
	//   enableHiding: false,
	// },
	{
		accessorKey: "id",
		header: () => <span>Nº da Carta</span>,
	},
	{
		accessorKey: "name",
		header: "Nome da Carta",
	},
	{
		accessorKey: "sender",
		header: () => <span>Total de pontos de ganhos do lançador</span>,
		cell: ({ row }) => {
			return (
				<span>
					{row.original.sender.defense +
						row.original.sender.justice +
						row.original.sender.money}
				</span>
			);
		},
	},
	{
		accessorKey: "receiver",
		header: () => <span>Total de pontos de ganhos do destinatário</span>,
		cell: ({ row }) => {
			return (
				<span>
					{row.original.receiver.defense +
						row.original.receiver.justice +
						row.original.receiver.money}
				</span>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row, handleDeleteRow }: any) => {
			const Card = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Abrir menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="sm:w-[260px]">
						<DropdownMenuLabel>Ações</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(Card.id.toString())}
						>
							Copiar número da carta
						</DropdownMenuItem>
						<DropdownMenuItem>
							<DialogTrigger className="w-full flex justify-between items-center">
								<span className="block">Editar</span>{" "}
								<Pen className="w-4 h-4 ml-4" />
							</DialogTrigger>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Button
								variant="destructive"
								onClick={handleDeleteRow}
								className="w-full justify-between"
							>
								Deletar carta <Trash className="w-4 h-4 ml-4" />
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export const CardTable = ({ data }: { data: any }) => {
	const router = useRouter();
	const supabase = createClientComponentClient();

	const [rows, setRows] = React.useState<Card[]>(
		data.sort((a: any, b: any) => a.id - b.id),
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});

	function handleNewCard(card: Card) {
		setRows((prev) => [...prev, card].sort((a: any, b: any) => a.id - b.id));
	}

	function handleUpdateCard(card: Card) {
		setRows((prev) => {
			const newPrev = [...prev];
			newPrev[newPrev.findIndex(({ id }) => card.id === id)] = card;
			return newPrev;
		});
	}

	const table = useReactTable({
		data: rows,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	return (
		<div className="w-full">
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Nome da carta..."
					value={
						(table.getColumn("name")?.getFilterValue() as string) ?? undefined
					}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<Dialog handleCard={handleNewCard} cardsIds={rows.map(({ id }) => id)}>
					<DialogTrigger asChild className="w-fit flex justify-between">
						<Button variant="outline">
							Criar carta <Plus className="w-4 h-4 ml-4" />
						</Button>
					</DialogTrigger>
				</Dialog>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, i) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									<Dialog
										card={row.original}
										handleCard={handleUpdateCard}
										cardsIds={rows.map(({ id }) => id)}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, {
													...cell.getContext(),
													handleDeleteRow: async () => {
														await supabase
															.from("cards")
															.delete()
															.eq("id", row.original.id)
															.then((res) => {
																if (res.error)
																	return toast.error(
																		"Ocorreu um erro ao deletar sua carta! Tente novamente mais tarde.",
																	);

																router.refresh();
																toast.success("Carta deletada com sucesso");
															});
													},
												})}
											</TableCell>
										))}
									</Dialog>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Nenhuma carta ainda.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} de{" "}
					{table.getFilteredRowModel().rows.length} linha(s) selecionadas.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Voltar
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Avançar
					</Button>
				</div>
			</div>
		</div>
	);
};
