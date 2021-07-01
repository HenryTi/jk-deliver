import { observer } from "mobx-react";
import React from "react";
import { List, VPage, LMR, FA } from "tonva-react";
import { ReturnWarehouseDeliverMainRet, ReturnWarehousePendingDeliverRet } from "uq-app/uqs/JkDeliver";
import { ReturnWarehousePickupsRet } from "uq-app/uqs/JkWarehouse";
import { CHome } from "./CHome";

export class VHome extends VPage<CHome> {
	header() {return '首页'}
	content() {
		return React.createElement(observer(() => {
			// 这个页面每10秒刷一次。因为很少人用，每次数据库查询很小
			let {warehousePending, onPickup, onDeliverMain} = this.controller;
			let content: any;
			if (!warehousePending) {
				content = <FA name="spinner" spin={true} className="text-info mx-3" size="lg" />;
			}
			else {
				content = warehousePending.map(v => {
					let {warehouse, pickups, deliverMains} = v;
					return <div key={warehouse} className="mb-3">
						<div className="mb-2 px-3 text-info font-weight-bold">
							仓库: {this.controller.uqs.JkDeliver.IDRender(warehouse)}
						</div>
						<List className="mb-3" items={pickups} none="无拣货单"
							item={{render: this.renderPickup, onClick: onPickup}} />
						<List className="mb-3" items={deliverMains} none="无发货单"
							item={{render: this.renderDeliverMain, onClick: onDeliverMain}} />
					</div>
				});
			}
			return <div className="my-3">{content}</div>;
		}));
		// <List className="mb-3" items={delivers} none="无发货指令"
		// 	item={{render: this.renderPending, onClick: createPickup}} />
}

	private renderPending = (row: ReturnWarehousePendingDeliverRet, index: number): JSX.Element => {
		let {warehouse, rowCount} = row;
		let left = <div className="w-8c text-primary">仓库待发</div>;
		let right = <span className="text-success">{rowCount}</span>;
		return <LMR className="px-3 py-2" left={left} right={right}>
			warehouse:{this.controller.uqs.JkDeliver.IDRender(warehouse)}
		</LMR>
	}

	private renderPickup = (row: ReturnWarehousePickupsRet, index: number): JSX.Element => {
		let {no, picker} = row;
		let left = <div className="w-8c text-primary">拣货单</div>;
		let right:any;
		if (picker) {
			right = <span>{this.renderUser(picker)}在拣</span>
		}
		return <LMR className="px-3 py-2" left={left} right={right}>
			<b>{no}</b>
		</LMR>
	}

	private renderDeliverMain = (row: ReturnWarehouseDeliverMainRet, index: number): JSX.Element => {
		let {deliverMain, no, customer, create, rows, pickRows, staff} = row;
		let left = <div className="w-8c text-primary">发运单</div>;
		let right = pickRows===rows?
			(
				staff ? 
				<span>{this.renderUser(staff)} <span className="text-success">发前确认</span></span>
				:
				<span className="text-danger">可发运</span>
			)
			:
			<span className="text-muted">待拣货</span>;
		return <LMR className="px-3 py-2" left={left} right={right}>
			<b>{no}</b> &nbsp; 
			客户: {this.controller.uqs.JkDeliver.IDRender(customer)}
		</LMR>
	}
}
