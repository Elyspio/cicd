import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));


export function SimpleAccordion(props: { label: string, children?: React.ReactChild[] | React.ReactChild }) {
    const classes = useStyles();

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="label-content"
                id="label-header"
            >
                <Typography className={classes.heading}>{props.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {props.children}
            </AccordionDetails>
        </Accordion>
    );
}
