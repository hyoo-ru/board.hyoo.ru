namespace $.$$ {
	
	export 	type $hyoo_board_link = { title: string, uri: string }

	export class $hyoo_board extends $.$hyoo_board {
		
		override groups_all( next?: string[] ) {
			return this.$.$mol_state_local.value( `group/list`, next ) ?? super.groups_all()
		}
		
		override group_add( after: string, links: $hyoo_board_link[] ) {
			const list = this.groups_all().slice()
			const index = list.indexOf( after ) + 1
			const id = $mol_guid()
			list.splice( index, 0, id )
			this.group_links( id, links )
			this.groups_all( list )
		}
		
		override group_delete( group: string ) {
			const list = this.groups_all().filter( g => g !== group )
			if( !list.length ) list.push( '' )
			this.groups_all( list )
		}
		
		@ $mol_mem
		override groups() {
			return this.groups_all().map( id => this.Group(id) )
		}
		
		override group_title( group: string, next?: string ) {
			return this.$.$mol_state_local.value( `group=${group}/title`, next )
				?? ( group ? '' : '' )
		}
		
		override group_links( group: string, next?: $hyoo_board_link[] ) {
			return this.$.$mol_state_local.value( `group=${group}/links`, next ) ?? []
		}
		
		override link_adopt( transfer: DataTransfer ): null | $hyoo_board_link[] {
			
			const html = transfer.getData( 'text/html' )
			if( html ) {
				const dom = $mol_dom_parse( html, 'text/html' )
				const els = dom.getElementsByTagName( 'a' )
				
				const links: $hyoo_board_link[] = [ ... els ].map( el => {
					const img = el.querySelector( 'img' )
					return {
						title: el.textContent!.trim() + ( img ? ' ' + img.src : '' ),
						uri: el.getAttribute( 'href' )!,
					}
				 } )
				
				if( links.length ) return links
			}
			
			const links = transfer.getData( 'text/uri-list' ).split( /\r?\n/g ).filter( Boolean )
			
			if( links.length ) return links.map( link => ({
				title: decodeURIComponent( link.replace( /^.*(?:\/\/|[?#])([^?#]+)$/, '$1' ) )
					.split('\n')[0]
					.replace( /\/+$/, '' ),
				uri: link,
			}) )
			
			return null
		}
		
	}

}
