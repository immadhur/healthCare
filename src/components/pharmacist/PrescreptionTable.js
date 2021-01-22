import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const TAX_RATE = 0.05;

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

export default function PrescreptionTable(props) {
    const classes = useStyles();

    // const invoiceSubtotal = subtotal();
    // const invoiceTaxes = TAX_RATE * invoiceSubtotal;
    // const invoiceTotal = invoiceTaxes + invoiceSubtotal;

    function subtotal() {
        let sum = 0;
            props.price.forEach((price, i) => sum += (price * props.qty[i]));
        return sum;
    }

    return (
        
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={6}>
                            Billing Details
            </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Medicine Name</TableCell>
                        <TableCell align="right">Prescribed Quantity</TableCell>
                        <TableCell align="right">Quantity Given</TableCell>
                        <TableCell align="right">Price/Tablet</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.pres.map((row, i) => (
                        <TableRow key={row.name}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">{row.qty}</TableCell>
                            <TableCell align="right">
                                <input type='number' onChange={(e) => props.change(e, i, 'qty')} />
                            </TableCell>
                            <TableCell align="right">
                                <input type='number' onChange={(e) => props.change(e, i, 'price')} />
                            </TableCell>
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2}>Subtotal</TableCell>
                        <TableCell align="right">{ccyFormat(subtotal())}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>GST</TableCell>
                        <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                        <TableCell align="right">{ccyFormat(subtotal()*TAX_RATE)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell align="right">{ccyFormat(subtotal()+subtotal()*TAX_RATE)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

