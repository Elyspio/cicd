import * as React from 'react';
import {ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, {AccordionProps} from '@mui/material/Accordion';
import MuiAccordionSummary, {AccordionSummaryProps,} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} children={props.children}/>
))(({theme}) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&:before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}
		{...props}
	/>
))(({theme}) => ({
	height: 60,
	width: "100%",
	backgroundColor:
		theme.palette.mode === 'dark'
			? 'rgba(255, 255, 255, .05)'
			: 'rgba(0, 0, 0, .03)',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
	padding: theme.spacing(2),
	borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

type Props = {
	label: ReactNode,
	children: ReactNode
}

export function SimpleAccordion({children, label}: Props) {
	const [expanded, setExpanded] = React.useState<string | false>('panel1');

	const handleChange =
		(panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
			setExpanded(newExpanded ? panel : false);
		};

	return (
		<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
			<AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className={"full-w"}>
				<Typography component={"div"} className={"full-w"}>{label}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				{children}
			</AccordionDetails>
		</Accordion>
	);
}
